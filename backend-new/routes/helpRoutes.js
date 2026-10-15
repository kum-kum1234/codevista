const express = require("express");

const {
  getHelpContent,
  upsertHelpContent,
  deleteHelpContent,
} = require("../controllers/helpController");

const auth = require("../src/middlewares/auth.middleware");
const { requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();

// Get Help page content
router.get("/", getHelpContent);

// Create or update Help page content
router.put(
  "/",
  auth,
  requireAdmin,
  upsertHelpContent
);

// Delete Help page content
router.delete(
  "/",
  auth,
  requireAdmin,
  deleteHelpContent
);

module.exports = router;