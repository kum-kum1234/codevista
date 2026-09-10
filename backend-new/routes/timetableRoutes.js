const express = require("express");

const {
  getTimetable,
  saveTimetable,
  clearTimetable,
} = require("../controllers/timetableController");

const router = express.Router();

router.get("/:userId", getTimetable);

router.put("/:userId", saveTimetable);

router.delete("/:userId", clearTimetable);

module.exports = router;