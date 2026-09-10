const express = require("express");

const controller = require("../controllers/pythonHelpController");

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
  controller.createPythonHelpTopic
);

router.put(
  "/topics/:topicId",
  controller.updatePythonHelpTopic
);

router.delete(
  "/topics/:topicId",
  controller.deletePythonHelpTopic
);


module.exports = router;