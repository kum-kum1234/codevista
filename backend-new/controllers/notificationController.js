const Notification =
  require("../models/Notification");

const PushSubscription =
  require("../models/PushSubscription");

const {
  sendNotificationToUser,
} = require("../services/notificationService");


function formatNotification(
  notification
) {
  return {
    id: notification._id.toString(),

    userId:
      notification.userId,

    type:
      notification.type,

    title:
      notification.title,

    message:
      notification.message,

    link:
      notification.link || "",

    read:
      notification.read,

    data:
      notification.data || {},

    createdAt:
      notification.createdAt,
  };
}


// ========================================
// GET VAPID PUBLIC KEY
// ========================================

exports.getPublicKey = async (
  req,
  res
) => {
  return res.json({
    success: true,

    publicKey:
      process.env.VAPID_PUBLIC_KEY || "",
  });
};


// ========================================
// SAVE BROWSER SUBSCRIPTION
// ========================================

exports.subscribe = async (
  req,
  res
) => {
  try {
    const userId =
      String(
        req.body.userId || ""
      ).trim();

    const subscription =
      req.body.subscription;


    if (
      !userId ||
      !subscription?.endpoint ||
      !subscription?.keys
    ) {
      return res.status(400).json({
        success: false,

        message:
          "userId and a valid push subscription are required",
      });
    }


    const saved =
      await PushSubscription.findOneAndUpdate(
        {
          endpoint:
            subscription.endpoint,
        },

        {
          $set: {
            userId,

            endpoint:
              subscription.endpoint,

            expirationTime:
              subscription.expirationTime ??
              null,

            keys: {
              p256dh:
                subscription.keys.p256dh,

              auth:
                subscription.keys.auth,
            },

            active: true,
          },
        },

        {
          new: true,

          upsert: true,

          runValidators: true,
        }
      );


    return res.json({
      success: true,

      message:
        "Push subscription saved",

      subscriptionId:
        saved._id.toString(),
    });
  } catch (error) {
    console.error(
      "Subscribe notification error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to save push subscription",

      error:
        error.message,
    });
  }
};


// ========================================
// DISABLE BROWSER SUBSCRIPTION
// ========================================

exports.unsubscribe = async (
  req,
  res
) => {
  try {
    const userId =
      String(
        req.body.userId || ""
      ).trim();

    const endpoint =
      String(
        req.body.endpoint || ""
      ).trim();


    if (!userId || !endpoint) {
      return res.status(400).json({
        success: false,

        message:
          "userId and endpoint are required",
      });
    }


    await PushSubscription.updateOne(
      {
        userId,

        endpoint,
      },

      {
        $set: {
          active: false,
        },
      }
    );


    return res.json({
      success: true,

      message:
        "Push subscription disabled",
    });
  } catch (error) {
    console.error(
      "Unsubscribe notification error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to disable push subscription",

      error:
        error.message,
    });
  }
};


// ========================================
// GET USER NOTIFICATIONS
// ========================================

exports.getNotifications = async (
  req,
  res
) => {
  try {
    const userId =
      String(
        req.params.userId || ""
      ).trim();


    if (!userId) {
      return res.status(400).json({
        success: false,

        message:
          "userId is required",
      });
    }


    const notifications =
      await Notification.find({
        userId,

        active: true,
      })
        .sort({
          createdAt: -1,
        })
        .limit(50)
        .lean();


    const unreadCount =
      await Notification.countDocuments({
        userId,

        active: true,

        read: false,
      });


    return res.json({
      success: true,

      unreadCount,

      notifications:
        notifications.map(
          formatNotification
        ),
    });
  } catch (error) {
    console.error(
      "Get notifications error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to fetch notifications",

      error:
        error.message,
    });
  }
};


// ========================================
// MARK ONE AS READ
// ========================================

exports.markAsRead = async (
  req,
  res
) => {
  try {
    const userId =
      String(
        req.body.userId || ""
      ).trim();

    const notificationId =
      String(
        req.params.notificationId || ""
      ).trim();


    const notification =
      await Notification.findOneAndUpdate(
        {
          _id: notificationId,

          userId,
        },

        {
          $set: {
            read: true,
          },
        },

        {
          new: true,
        }
      );


    if (!notification) {
      return res.status(404).json({
        success: false,

        message:
          "Notification not found",
      });
    }


    return res.json({
      success: true,

      notification:
        formatNotification(
          notification
        ),
    });
  } catch (error) {
    console.error(
      "Mark notification read error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to mark notification as read",

      error:
        error.message,
    });
  }
};


// ========================================
// MARK ALL AS READ
// ========================================

exports.markAllAsRead = async (
  req,
  res
) => {
  try {
    const userId =
      String(
        req.params.userId || ""
      ).trim();


    await Notification.updateMany(
      {
        userId,

        active: true,

        read: false,
      },

      {
        $set: {
          read: true,
        },
      }
    );


    return res.json({
      success: true,

      message:
        "All notifications marked as read",
    });
  } catch (error) {
    console.error(
      "Mark all notifications read error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to mark notifications as read",

      error:
        error.message,
    });
  }
};


// ========================================
// TEST NOTIFICATION
// ========================================

// Development/testing endpoint.
// Remove or protect this before production.

exports.sendTestNotification = async (
  req,
  res
) => {
  try {
    const userId =
      String(
        req.body.userId || ""
      ).trim();


    if (!userId) {
      return res.status(400).json({
        success: false,

        message:
          "userId is required",
      });
    }


    const result =
      await sendNotificationToUser({
        userId,

        type:
          req.body.type ||
          "test",

        title:
          req.body.title ||
          "CodeVista Test Notification",

        message:
          req.body.message ||
          "Your CodeVista browser notifications are working.",

        link:
          req.body.link ||
          "/profile",
      });


    return res.json({
      success: true,

      result,
    });
  } catch (error) {
    console.error(
      "Send test notification error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to send test notification",

      error:
        error.message,
    });
  }
};