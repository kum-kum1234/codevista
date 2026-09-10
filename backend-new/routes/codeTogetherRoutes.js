const express = require("express");

const controller = require("../controllers/codeTogetherController");

const router = express.Router();

router.get(
  "/",
  controller.getCodeTogether
);

router.put(
  "/content",
  controller.upsertCodeTogetherContent
);

router.post(
  "/registrations",
  controller.registerForCodeTogether
);

router.delete(
  "/registrations/:dateKey",
  controller.cancelCodeTogetherRegistration
);

module.exports = router;