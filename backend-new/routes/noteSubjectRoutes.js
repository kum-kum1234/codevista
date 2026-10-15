const express = require("express");

const noteSubjectController = require("../controllers/noteSubjectController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router = express.Router();

router.get(
  "/:userId",
  auth,
  requireOwner,
  noteSubjectController.getSubjects
);

router.post(
  "/",
  auth,
  requireOwner,
  noteSubjectController.addSubject
);

router.put(
  "/:userId/reorder",
  auth,
  requireOwner,
  noteSubjectController.reorderSubjects
);

module.exports = router;