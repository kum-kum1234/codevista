const express = require("express");

const {
  getWeeklyReport,
  createSnapshot,
  sendWeeklyReportNotification,
} = require("../controllers/weeklyReportController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router =
  express.Router();

// Get calculated weekly report
router.get(
  "/:userId",
  auth,
  requireOwner,
  getWeeklyReport
);

// Create/update current week's snapshot
router.post(
  "/:userId/snapshot",
  auth,
  requireOwner,
  createSnapshot
);

// TEST: send weekly browser notification
router.post(
  "/:userId/send",
  auth,
  requireOwner,
  sendWeeklyReportNotification
);

module.exports = router;