const express = require("express");

const noteController = require("../controllers/noteController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router = express.Router();

router.get(
  "/:userId",
  auth,
  requireOwner,
  noteController.getNotes
);

router.post(
  "/",
  auth,
  requireOwner,
  noteController.createNote
);

router.put(
  "/:noteId",
  auth,
  requireOwner,
  noteController.updateNote
);

router.delete(
  "/:noteId",
  auth,
  requireOwner,
  noteController.deleteNote
);

router.patch(
  "/:noteId/pin",
  auth,
  requireOwner,
  noteController.togglePin
);

module.exports = router;