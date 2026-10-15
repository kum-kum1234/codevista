const express = require("express");

const {
  getAchievements,
  createAchievement,
  updateAchievement,
  getUserStats,
  updateUserStats,
  getUserAchievements,
  getUnlockedAchievements,
  recordActivity,
} = require("../controllers/achievementController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner, requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();

// =====================================================
// ACHIEVEMENT DEFINITIONS
// =====================================================

router.get(
  "/",
  getAchievements
);

router.post(
  "/",
  auth,
  requireAdmin,
  createAchievement
);

router.put(
  "/:achievementId",
  auth,
  requireAdmin,
  updateAchievement
);

router.post(
  "/activity",
  auth,
  requireOwner,
  recordActivity
);

// =====================================================
// USER ACHIEVEMENT STATISTICS
// =====================================================

router.get(
  "/user/:userId/stats",
  auth,
  requireOwner,
  getUserStats
);

router.put(
  "/user/:userId/stats",
  auth,
  requireAdmin,
  updateUserStats
);

// =====================================================
// USER ACHIEVEMENTS
// =====================================================

router.get(
  "/user/:userId",
  auth,
  requireOwner,
  getUserAchievements
);

router.get(
  "/user/:userId/unlocked",
  auth,
  requireOwner,
  getUnlockedAchievements
);

module.exports = router;