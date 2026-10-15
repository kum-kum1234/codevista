const express = require("express");
const profileController = require("../controllers/profileController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router = express.Router();

router.get(
  "/:userId",
  auth,
  requireOwner,
  profileController.getProfile
);

router.put(
  "/:userId",
  auth,
  requireOwner,
  profileController.updateProfile
);

router.patch(
  "/:userId/notifications",
  auth,
  requireOwner,
  profileController.updateNotifications
);

router.delete(
  "/:userId",
  auth,
  requireOwner,
  profileController.deleteProfile
);

module.exports = router;