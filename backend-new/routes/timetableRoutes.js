const express = require("express");

const {
  getTimetable,
  saveTimetable,
  clearTimetable,
} = require("../controllers/timetableController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router = express.Router();

router.get(
  "/:userId",
  auth,
  requireOwner,
  getTimetable
);

router.put(
  "/:userId",
  auth,
  requireOwner,
  saveTimetable
);

router.delete(
  "/:userId",
  auth,
  requireOwner,
  clearTimetable
);

module.exports = router;