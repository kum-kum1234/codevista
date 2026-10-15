const express = require("express");

const notificationController =
  require("../controllers/notificationController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner, requireAdmin } = require("../src/middlewares/access.middleware");

const router =
  express.Router();


// Browser push setup
router.get(
  "/public-key",
  notificationController.getPublicKey
);

router.post(
  "/subscribe",
  auth,
  requireOwner,
  notificationController.subscribe
);

router.post(
  "/unsubscribe",
  auth,
  requireOwner,
  notificationController.unsubscribe
);


// Notification data
router.get(
  "/:userId",
  auth,
  requireOwner,
  notificationController.getNotifications
);

router.patch(
  "/:notificationId/read",
  auth,
  requireOwner,
  notificationController.markAsRead
);

router.patch(
  "/:userId/read-all",
  auth,
  requireOwner,
  notificationController.markAllAsRead
);


// Development testing
router.post(
  "/test/send",
  auth,
  requireAdmin,
  notificationController.sendTestNotification
);


module.exports = router;