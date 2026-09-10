const express = require("express");

const {
  getStarters,
  createStarter,
  getChallenges,
  createChallenge,
  updateChallenge,
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
} = require("../controllers/playgroundController");

const router = express.Router();

// =====================================================
// PLAYGROUND STARTERS
// =====================================================

router.get("/starters", getStarters);

router.post("/starters", createStarter);

// =====================================================
// PLAYGROUND CHALLENGES
// =====================================================

router.get("/challenges", getChallenges);

router.post("/challenges", createChallenge);

router.put("/challenges/:challengeId", updateChallenge);

// =====================================================
// PLAYGROUND PROJECTS
// =====================================================

router.get("/projects", getProjects);

router.post("/projects", saveProject);

router.put("/projects/:projectId", updateProject);

router.delete("/projects/:projectId", deleteProject);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;