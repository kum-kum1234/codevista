const {
  TurtleTemplate,
  TurtleSettings,
  TurtleProject,
} = require("../models/TurtleStudio");

// =====================================================
// GET TEMPLATES
// =====================================================

const getTemplates = async (req, res) => {
  try {
    const templates = await TurtleTemplate.find({
      active: true,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error(
      "Get turtle templates error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch turtle templates",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE TEMPLATE
// For Postman/admin use
// =====================================================

const createTemplate = async (req, res) => {
  try {
    const {
      templateId,
      name,
      description,
      code,
      language,
    } = req.body;

    if (!templateId || !name || !code) {
      return res.status(400).json({
        success: false,
        message:
          "templateId, name and code are required",
      });
    }

    const existing =
      await TurtleTemplate.findOne({
        templateId,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Template already exists",
      });
    }

    const template =
      await TurtleTemplate.create({
        templateId,
        name,
        description: description || "",
        code,
        language: language || "python",
      });

    res.status(201).json({
      success: true,
      template,
    });
  } catch (error) {
    console.error(
      "Create turtle template error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create turtle template",
      error: error.message,
    });
  }
};

// =====================================================
// GET TURTLE SETTINGS
// =====================================================

const getSettings = async (req, res) => {
  try {
    const settings =
      await TurtleSettings.findOne({
        settingId: "default",
        active: true,
      });

    if (!settings) {
      return res.status(404).json({
        success: false,
        message: "Turtle settings not found",
      });
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Get turtle settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch turtle settings",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE / UPDATE SETTINGS
// For Postman/admin use
// =====================================================

const upsertSettings = async (req, res) => {
  try {
    const {
      swatches,
      defaultPenColor,
      language,
    } = req.body;

    const settings =
      await TurtleSettings.findOneAndUpdate(
        {
          settingId: "default",
        },
        {
          settingId: "default",
          swatches: Array.isArray(swatches)
            ? swatches
            : [],
          defaultPenColor:
            defaultPenColor || "#8B5CF6",
          language: language || "python",
          active: true,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Update turtle settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update turtle settings",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER PROJECTS
// =====================================================

const getProjects = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const projects =
      await TurtleProject.find({
        userId,
      }).sort({
        updatedAt: -1,
      });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error(
      "Get turtle projects error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch turtle projects",
      error: error.message,
    });
  }
};

// =====================================================
// SAVE PROJECT
// =====================================================

const saveProject = async (req, res) => {
  try {
    const {
      userId,
      title,
      description,
      code,
      penColor,
      templateName,
      language,
    } = req.body;

    if (!userId || !title || !code) {
      return res.status(400).json({
        success: false,
        message:
          "userId, title and code are required",
      });
    }

    const project =
      await TurtleProject.create({
        userId,
        title,
        description: description || "",
        code,
        penColor: penColor || "#8B5CF6",
        templateName: templateName || "",
        language: language || "python",
      });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "Save turtle project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to save turtle project",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE PROJECT
// =====================================================

const updateProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const {
      userId,
      title,
      description,
      code,
      penColor,
      templateName,
      language,
    } = req.body;

    if (!userId || !title || !code) {
      return res.status(400).json({
        success: false,
        message:
          "userId, title and code are required",
      });
    }

    const project =
      await TurtleProject.findOneAndUpdate(
        {
          _id: projectId,
          userId,
        },
        {
          title,
          description: description || "",
          code,
          penColor: penColor || "#8B5CF6",
          templateName: templateName || "",
          language: language || "python",
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "Update turtle project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to update turtle project",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE PROJECT
// =====================================================

const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const project =
      await TurtleProject.findOneAndDelete({
        _id: projectId,
        userId,
      });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete turtle project error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to delete turtle project",
      error: error.message,
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getTemplates,
  createTemplate,
  getSettings,
  upsertSettings,
  getProjects,
  saveProject,
  updateProject,
  deleteProject,
};