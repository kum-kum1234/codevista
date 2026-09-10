const webpush = require("web-push");

const Notification = require("../models/Notification");
const PushSubscription = require("../models/PushSubscription");
const Profile = require("../models/Profile");

// ========================================
// Notification preference mapping
// ========================================

const preferenceByType = {
  course: "courseUpdates",
  achievement: "achievements",
  weekly: "weeklyReport",
};

// ========================================
// Configure Web Push
// ========================================

function configureWebPush() {
  const {
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY,
    VAPID_SUBJECT,
  } = process.env;

  if (
    !VAPID_PUBLIC_KEY ||
    !VAPID_PRIVATE_KEY ||
    !VAPID_SUBJECT
  ) {
    throw new Error(
      "VAPID environment variables are not configured"
    );
  }

  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
}

// ========================================
// Send notification to user
// ========================================

async function sendNotificationToUser({
  userId,
  type,
  title,
  message,
  link = "",
  data = {},
}) {
  // Find user's profile
  const profile = await Profile.findOne({
    userId,
  });

  // Find which Profile setting controls
  // this notification type
  const preferenceField = preferenceByType[type];

  // Check user's notification preference
  if (
    preferenceField &&
    profile &&
    profile.notifications?.[preferenceField] === false
  ) {
    return {
      skipped: true,
      reason: "User disabled this notification type",
      notification: null,
      sent: 0,
      removed: 0,
    };
  }

  // Save notification in MongoDB
  const notification = await Notification.create({
    userId,
    type,
    title,
    message,
    link,
    data,
  });

  // Configure Web Push
  configureWebPush();

  // Find user's active browsers/devices
  const subscriptions = await PushSubscription.find({
    userId,
    active: true,
  });

  const payload = JSON.stringify({
    notificationId: notification._id.toString(),
    type,
    title,
    message,
    link,
    data,
  });

  let sent = 0;
  let removed = 0;

  // Send notification to every registered browser
  for (const subscription of subscriptions) {
    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          expirationTime: subscription.expirationTime,
          keys: subscription.keys,
        },
        payload,
        {
          TTL: 3600,
        }
      );

      sent += 1;

      console.log(
        `Push notification sent successfully to ${userId}`
      );
    } catch (error) {
      console.error("Push notification failed:", {
        message: error.message,
        statusCode: error.statusCode,
        body: error.body,
        headers: error.headers,
        endpoint: subscription.endpoint,
      });

      // Browser subscription expired
      // or is no longer valid
      if (
        error.statusCode === 404 ||
        error.statusCode === 410
      ) {
        subscription.active = false;

        await subscription.save();

        removed += 1;

        console.log(
          `Removed invalid push subscription for ${userId}`
        );
      }
    }
  }

  return {
    skipped: false,
    notification,
    sent,
    removed,
  };
}

module.exports = {
  sendNotificationToUser,
};