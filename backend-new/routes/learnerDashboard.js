const express = require("express");

const router =
  express.Router();

const {
  getLearnerDashboard
} = require(
  "../controllers/learnerDashboardController"
);


// ============================================================
// AUTHENTICATION
// ============================================================

const authMiddleware =
  require("../middlewares/auth");


// ============================================================
// GET LEARNER DASHBOARD
// ============================================================

router.get(
  "/learner",
  authMiddleware,
  getLearnerDashboard
);


module.exports = router;