const express = require("express");

const {
  getTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  getSettings,
  upsertSettings,
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
} = require("../controllers/turtleStudioController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner, requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();

// =====================================================
// TEMPLATES
// =====================================================

router.get("/templates", getTemplates);

router.post(
  "/templates",
  auth,
  requireAdmin,
  createTemplate
);

router.put(
  "/templates/:templateId",
  auth,
  requireAdmin,
  updateTemplate
);

router.delete(
  "/templates/:templateId",
  auth,
  requireAdmin,
  deleteTemplate
);

// =====================================================
// SETTINGS
// =====================================================

router.get("/settings", getSettings);

router.put(
  "/settings",
  auth,
  requireAdmin,
  upsertSettings
);

// =====================================================
// PROJECTS
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