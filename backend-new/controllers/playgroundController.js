const {
  PlaygroundStarter,
  PlaygroundProject,
  PlaygroundChallenge,
} = require("../models/Playground");

const { trackActivity } = require("../services/activityService");

// =====================================================
// GET STARTERS
// =====================================================

const getStarters = async (req, res) => {
  try {
    const starters = await PlaygroundStarter.find({
      active: true,
    }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      starters,
    });
  } catch (error) {
    console.error("Get playground starters error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch playground starters",
    });
  }
};

// =====================================================
// CREATE STARTER
// For Postman/admin use
// =====================================================

const createStarter = async (req, res) => {
  try {
    const {
      starterId,
      title,
      description,
      code,
      language,
    } = req.body;

    if (!starterId || !title || !code) {
      return res.status(400).json({
        success: false,
        message: "starterId, title and code are required",
      });
    }

    const existing = await PlaygroundStarter.findOne({
      starterId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Starter already exists",
      });
    }

    const starter = await PlaygroundStarter.create({
      starterId,
      title,
      description: description || "",
      code,
      language: language || "python",
    });

    res.status(201).json({
      success: true,
      starter,
    });
  } catch (error) {
    console.error("Create playground starter error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create playground starter",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE STARTER
// For Postman/admin use
// =====================================================

const updateStarter = async (req, res) => {
  try {
    const { starterId } = req.params;

    const {
      title,
      description,
      code,
      language,
      active,
    } = req.body;

    if (!title || !code) {
      return res.status(400).json({
        success: false,
        message: "title and code are required",
      });
    }

    const starter =
      await PlaygroundStarter.findOneAndUpdate(
        {
          starterId,
        },
        {
          title,
          description: description || "",
          code,
          language: language || "python",
          active:
            typeof active === "boolean"
              ? active
              : true,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!starter) {
      return res.status(404).json({
        success: false,
        message: "Starter not found",
      });
    }

    res.status(200).json({
      success: true,
      starter,
    });
  } catch (error) {
    console.error("Update playground starter error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update playground starter",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE STARTER
// For Postman/admin use
// =====================================================

const deleteStarter = async (req, res) => {
  try {
    const { starterId } = req.params;

    const starter =
      await PlaygroundStarter.findOneAndDelete({
        starterId,
      });

    if (!starter) {
      return res.status(404).json({
        success: false,
        message: "Starter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Starter deleted successfully",
    });
  } catch (error) {
    console.error("Delete playground starter error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete playground starter",
      error: error.message,
    });
  }
};

// =====================================================
// GET CHALLENGES
// =====================================================

const getChallenges = async (req, res) => {
  try {
    const challenges = await PlaygroundChallenge.find({
      active: true,
    }).sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error("Get playground challenges error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch playground challenges",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE CHALLENGE
// For Postman/admin use
// =====================================================

const createChallenge = async (req, res) => {
  try {
    const {
      challengeId,
      title,
      description,
      difficulty,
      language,
      validationType,
      testCases,
    } = req.body;

    if (!challengeId || !title || !description) {
      return res.status(400).json({
        success: false,
        message: "challengeId, title and description are required",
      });
    }

    const existing = await PlaygroundChallenge.findOne({
      challengeId,
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Challenge already exists",
      });
    }

    const challenge = await PlaygroundChallenge.create({
      challengeId,
      title,
      description,
      difficulty: difficulty || "Easy",
      language: language || "python",
      validationType: validationType || "general",
      testCases: Array.isArray(testCases) ? testCases : [],
    });

    res.status(201).json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error("Create playground challenge error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create playground challenge",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE CHALLENGE
// =====================================================

const updateChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const {
      title,
      description,
      difficulty,
      language,
      validationType,
      testCases,
      active,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "title and description are required",
      });
    }

    const challenge =
      await PlaygroundChallenge.findOneAndUpdate(
        {
          challengeId,
        },
        {
          title,
          description,
          difficulty: difficulty || "Easy",
          language: language || "python",
          validationType: validationType || "general",
          testCases: Array.isArray(testCases) ? testCases : [],
          active:
            typeof active === "boolean"
              ? active
              : true,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.status(200).json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error("Update playground challenge error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update playground challenge",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE CHALLENGE
// For Postman/admin use
// =====================================================

const deleteChallenge = async (req, res) => {
  try {
    const { challengeId } = req.params;

    const challenge =
      await PlaygroundChallenge.findOneAndDelete({
        challengeId,
      });

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (error) {
    console.error("Delete playground challenge error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete playground challenge",
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

    const projects = await PlaygroundProject.find({
      userId,
    }).sort({
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      projects,
    });
  } catch (error) {
    console.error("Get playground projects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch playground projects",
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
      language,
    } = req.body;

    if (!userId || !title || !code) {
      return res.status(400).json({
        success: false,
        message: "userId, title and code are required",
      });
    }

    const project = await PlaygroundProject.create({
      userId,
      title,
      description: description || "",
      code,
      language: language || "python",
    });

    await trackActivity(userId, {
      inc: { projectsCreated: 1, projectsSaved: 1 },
      xp: 15,
    });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Save playground project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save playground project",
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
      language,
    } = req.body;

    if (!userId || !title || !code) {
      return res.status(400).json({
        success: false,
        message: "userId, title and code are required",
      });
    }

    const project =
      await PlaygroundProject.findOneAndUpdate(
        {
          _id: projectId,
          userId,
        },
        {
          title,
          description: description || "",
          code,
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
    console.error("Update playground project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update playground project",
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
      await PlaygroundProject.findOneAndDelete({
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
    console.error("Delete playground project error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete playground project",
    });
  }
};

// =====================================================
// EXPORT
// =====================================================

module.exports = {
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
};