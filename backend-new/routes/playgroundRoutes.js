const express = require("express");

const {
  getStarters,
  createStarter,
  updateStarter,
  deleteStarter,
  getChallenges,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
} = require("../controllers/playgroundController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner, requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();

// =====================================================
// PLAYGROUND STARTERS
// =====================================================

router.get("/starters", getStarters);

router.post(
  "/starters",
  auth,
  requireAdmin,
  createStarter
);

router.put(
  "/starters/:starterId",
  auth,
  requireAdmin,
  updateStarter
);

router.delete(
  "/starters/:starterId",
  auth,
  requireAdmin,
  deleteStarter
);

// =====================================================
// PLAYGROUND CHALLENGES
// =====================================================

router.get("/challenges", getChallenges);

router.post(
  "/challenges",
  auth,
  requireAdmin,
  createChallenge
);

router.put(
  "/challenges/:challengeId",
  auth,
  requireAdmin,
  updateChallenge
);

router.delete(
  "/challenges/:challengeId",
  auth,
  requireAdmin,
  deleteChallenge
);

// =====================================================
// PLAYGROUND PROJECTS
// =====================================================

router.get(
  "/projects",
  auth,
  requireOwner,
  getProjects
);

router.post(
  "/projects",
  auth,
  requireOwner,
  saveProject
);

router.put(
  "/projects/:projectId",
  auth,
  requireOwner,
  updateProject
);

router.delete(
  "/projects/:projectId",
  auth,
  requireOwner,
  deleteProject
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;