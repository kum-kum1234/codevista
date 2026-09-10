const express = require("express");

const {
  getAchievements,
  createAchievement,
  updateAchievement,
  getUserStats,
  updateUserStats,
  getUserAchievements,
  getUnlockedAchievements,
} = require("../controllers/achievementController");

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
  createAchievement
);

router.put(
  "/:achievementId",
  updateAchievement
);

// =====================================================
// USER ACHIEVEMENT STATISTICS
// =====================================================

router.get(
  "/user/:userId/stats",
  getUserStats
);

router.put(
  "/user/:userId/stats",
  updateUserStats
);

// =====================================================
// USER ACHIEVEMENTS
// =====================================================

router.get(
  "/user/:userId",
  getUserAchievements
);

router.get(
  "/user/:userId/unlocked",
  getUnlockedAchievements
);

module.exports = router;