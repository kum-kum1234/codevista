const express = require("express");

const notificationController =
  require("../controllers/notificationController");

const router =
  express.Router();


// Browser push setup
router.get(
  "/public-key",
  notificationController.getPublicKey
);

router.post(
  "/subscribe",
  notificationController.subscribe
);

router.post(
  "/unsubscribe",
  notificationController.unsubscribe
);


// Notification data
router.get(
  "/:userId",
  notificationController.getNotifications
);

router.patch(
  "/:notificationId/read",
  notificationController.markAsRead
);

router.patch(
  "/:userId/read-all",
  notificationController.markAllAsRead
);


// Development testing
router.post(
  "/test/send",
  notificationController.sendTestNotification
);


module.exports = router;