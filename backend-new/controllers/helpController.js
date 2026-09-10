const Help = require("../models/Help");

// GET /api/help
async function getHelpContent(req, res) {
  try {
    const help = await Help.findOne({
      key: "default",
      active: true,
    }).lean();

    if (!help) {
      return res.status(404).json({
        success: false,
        message: "Help content not found",
      });
    }

    return res.status(200).json({
      success: true,
      help,
    });
  } catch (error) {
    console.error("Get help content error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load help content",
      error: error.message,
    });
  }
}

// PUT /api/help
async function upsertHelpContent(req, res) {
  try {
    // Accept either:
    // { faqs: [], features: [], ... }
    //
    // OR:
    // { help: { faqs: [], features: [], ... } }

    const data = req.body?.help || req.body;

    if (!data || typeof data !== "object") {
      return res.status(400).json({
        success: false,
        message: "Invalid help content data",
      });
    }

    const faqs = Array.isArray(data.faqs) ? data.faqs : [];
    const features = Array.isArray(data.features) ? data.features : [];
    const guideSteps = Array.isArray(data.guideSteps)
      ? data.guideSteps
      : [];

    const contact =
      data.contact && typeof data.contact === "object"
        ? data.contact
        : {};

    const active =
      typeof data.active === "boolean"
        ? data.active
        : true;

    const help = await Help.findOneAndUpdate(
      { key: "default" },
      {
        $set: {
          faqs,
          features,
          guideSteps,
          contact,
          active,
        },
        $setOnInsert: {
          key: "default",
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return res.status(200).json({
      success: true,
      message: "Help content saved successfully",
      help,
    });
  } catch (error) {
    console.error("Save help content error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save help content",
      error: error.message,
    });
  }
}

// DELETE /api/help
async function deleteHelpContent(req, res) {
  try {
    const deleted = await Help.findOneAndDelete({
      key: "default",
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Help content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Help content deleted successfully",
    });
  } catch (error) {
    console.error("Delete help content error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete help content",
      error: error.message,
    });
  }
}

module.exports = {
  getHelpContent,
  upsertHelpContent,
  deleteHelpContent,
};