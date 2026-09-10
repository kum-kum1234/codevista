const express = require("express");

const noteController = require("../controllers/noteController");

const router = express.Router();

router.get("/:userId", noteController.getNotes);

router.post("/", noteController.createNote);

router.put("/:noteId", noteController.updateNote);

router.delete("/:noteId", noteController.deleteNote);

router.patch("/:noteId/pin", noteController.togglePin);

module.exports = router;