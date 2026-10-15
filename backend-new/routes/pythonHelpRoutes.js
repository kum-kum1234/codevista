const express = require("express");

const controller = require("../controllers/pythonHelpController");

const auth = require("../src/middlewares/auth.middleware");
const { requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();


// ============================================================
// COMPLETE PAGE
// ============================================================

router.get(
  "/",
  controller.getPythonHelpGuide
);


// ============================================================
// CONTENT
// ============================================================

router.get(
  "/content",
  controller.getPythonHelpContent
);

router.put(
  "/content",
  auth,
  requireAdmin,
  controller.upsertPythonHelpContent
);


// ============================================================
// TOPICS
// ============================================================

router.get(
  "/topics",
  controller.getPythonHelpTopics
);

router.get(
  "/topics/:topicId",
  controller.getPythonHelpTopic
);

router.post(
  "/topics",
  auth,
  requireAdmin,
  controller.createPythonHelpTopic
);

router.put(
  "/topics/:topicId",
  auth,
  requireAdmin,
  controller.updatePythonHelpTopic
);

router.delete(
  "/topics/:topicId",
  auth,
  requireAdmin,
  controller.deletePythonHelpTopic
);


module.exports = router;