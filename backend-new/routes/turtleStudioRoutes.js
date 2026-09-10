const express = require("express");

const {
  getTemplates,
  createTemplate,
  getSettings,
  upsertSettings,
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
} = require("../controllers/turtleStudioController");

const router = express.Router();

// =====================================================
// TEMPLATES
// =====================================================

router.get("/templates", getTemplates);

router.post("/templates", createTemplate);

// =====================================================
// SETTINGS
// =====================================================

router.get("/settings", getSettings);

router.put("/settings", upsertSettings);

// =====================================================
// PROJECTS
// =====================================================

router.get("/projects", getProjects);

router.post("/projects", saveProject);

router.put("/projects/:projectId", updateProject);

router.delete(
  "/projects/:projectId",
  deleteProject
);

// =====================================================
// EXPORT
// =====================================================

module.exports = router;