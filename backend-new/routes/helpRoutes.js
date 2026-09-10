const express = require("express");

const {
  getHelpContent,
  upsertHelpContent,
  deleteHelpContent,
} = require("../controllers/helpController");

const router = express.Router();

// Get Help page content
router.get("/", getHelpContent);

// Create or update Help page content
router.put("/", upsertHelpContent);

// Delete Help page content
router.delete("/", deleteHelpContent);

module.exports = router;