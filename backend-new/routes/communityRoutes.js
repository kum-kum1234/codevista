const express = require("express");

const {
  getPosts,
  createPost,
  deletePost,
  getQuestions,
  createQuestion,
  getSettings,
  upsertSettings,
  getCommunityStats,
  updateCommunityUser,
  getLeaderboard,
  getChallenges,
  createChallenge,
} = require("../controllers/communityController");

const router = express.Router();

// =====================================================
// POSTS
// =====================================================

router.get("/posts", getPosts);

router.post("/posts", createPost);

router.delete(
  "/posts/:postId",
  deletePost
);

// =====================================================
// QUESTIONS
// =====================================================

router.get(
  "/questions",
  getQuestions
);

router.post(
  "/questions",
  createQuestion
);

// =====================================================
// SETTINGS
// =====================================================

router.get(
  "/settings",
  getSettings
);

router.put(
  "/settings",
  upsertSettings
);

// =====================================================
// COMMUNITY USER / STATS
// =====================================================

router.get(
  "/stats/:userId",
  getCommunityStats
);

router.put(
  "/users/:userId",
  updateCommunityUser
);

// =====================================================
// LEADERBOARD
// =====================================================

router.get(
  "/leaderboard",
  getLeaderboard
);

// =====================================================
// WEEKLY CHALLENGES
// =====================================================

router.get(
  "/challenges",
  getChallenges
);

router.post(
  "/challenges",
  createChallenge
);

module.exports = router;