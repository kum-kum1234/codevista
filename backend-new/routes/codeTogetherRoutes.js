/*
const express = require("express");

const controller = require("../controllers/codeTogetherController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner, requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();

router.get(
  "/",
  controller.getCodeTogether
);

router.put(
  "/content",
  auth,
  requireAdmin,
  controller.upsertCodeTogetherContent
);

router.post(
  "/registrations",
  auth,
  requireOwner,
  controller.registerForCodeTogether
);

router.delete(
  "/registrations/:dateKey",
  auth,
  requireOwner,
  controller.cancelCodeTogetherRegistration
);

module.exports = router;
*/