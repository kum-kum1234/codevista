const express = require("express");

const noteSubjectController = require("../controllers/noteSubjectController");

const router = express.Router();

router.get(
  "/:userId",
  noteSubjectController.getSubjects
);

router.post(
  "/",
  noteSubjectController.addSubject
);

router.put(
  "/:userId/reorder",
  noteSubjectController.reorderSubjects
);

module.exports = router;