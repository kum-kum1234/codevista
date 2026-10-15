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

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner, requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();

// =====================================================
// POSTS
// =====================================================

router.get("/posts", getPosts);

router.post(
  "/posts",
  auth,
  requireOwner,
  createPost
);

router.delete(
  "/posts/:postId",
  auth,
  requireOwner,
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
  auth,
  requireOwner,
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
  auth,
  requireAdmin,
  upsertSettings
);

// =====================================================
// COMMUNITY USER / STATS
// =====================================================

router.get(
  "/stats/:userId",
  auth,
  requireOwner,
  getCommunityStats
);

router.put(
  "/users/:userId",
  auth,
  requireAdmin,
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
  auth,
  requireAdmin,
  createChallenge
);

module.exports = router;