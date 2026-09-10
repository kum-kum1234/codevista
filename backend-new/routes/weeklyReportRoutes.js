const express = require("express");

const {
  getWeeklyReport,
  createSnapshot,
  sendWeeklyReportNotification,
} = require("../controllers/weeklyReportController");

const router =
  express.Router();

// Get calculated weekly report
router.get(
  "/:userId",
  getWeeklyReport
);

// Create/update current week's snapshot
router.post(
  "/:userId/snapshot",
  createSnapshot
);

// TEST: send weekly browser notification
router.post(
  "/:userId/send",
  sendWeeklyReportNotification
);

module.exports = router;