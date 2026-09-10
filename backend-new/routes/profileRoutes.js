const express = require("express");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.get(
  "/:userId",
  profileController.getProfile
);

router.put(
  "/:userId",
  profileController.updateProfile
);

router.patch(
  "/:userId/notifications",
  profileController.updateNotifications
);

router.delete(
  "/:userId",
  profileController.deleteProfile
);

module.exports = router;