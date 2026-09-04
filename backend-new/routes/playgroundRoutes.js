const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

// =====================================================
// PLAYGROUND STARTER SCHEMA
// =====================================================

const starterSchema = new mongoose.Schema(
  {
    starterId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      default: "python",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// PLAYGROUND PROJECT SCHEMA
// =====================================================

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    code: {
      type: String,
      required: true,
    },

    language: {
      type: String,
      default: "python",
    },
  },
  {
    timestamps: true,
  }
);

const PlaygroundStarter =
  mongoose.models.PlaygroundStarter ||
  mongoose.model(
    "PlaygroundStarter",
    starterSchema
  );

const PlaygroundProject =
  mongoose.models.PlaygroundProject ||
  mongoose.model(
    "PlaygroundProject",
    projectSchema
  );

// =====================================================
// PLAYGROUND CHALLENGE SCHEMA
// =====================================================

const challengeSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },

    language: {
      type: String,
      default: "python",
    },

    active: {
      type: Boolean,
      default: true,
    },

    validationType: {
      type: String,
      default: "general",
    },

    testCases: {
      type: [
        {
          input: {
            type: String,
            default: "",
          },

          expectedOutput: {
            type: String,
            required: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const PlaygroundChallenge =
  mongoose.models.PlaygroundChallenge ||
  mongoose.model(
    "PlaygroundChallenge",
    challengeSchema
  );

// =====================================================
// GET STARTERS
// =====================================================

router.get("/starters", async (req, res) => {
  try {
    const starters =
      await PlaygroundStarter.find({
        active: true,
      }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      starters,
    });
  } catch (error) {
    console.error(
      "Get playground starters error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch playground starters",
    });
  }
});

// =====================================================
// CREATE STARTER
// For Postman/admin use
// =====================================================

router.post("/starters", async (req, res) => {
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
        message:
          "starterId, title and code are required",
      });
    }

    const existing =
      await PlaygroundStarter.findOne({
        starterId,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Starter already exists",
      });
    }

    const starter =
      await PlaygroundStarter.create({
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
    console.error(
      "Create playground starter error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create playground starter",
      error: error.message,
    });
  }
});

// =====================================================
// GET CHALLENGES
// =====================================================

router.get("/challenges", async (req, res) => {
  try {
    const challenges =
      await PlaygroundChallenge.find({
        active: true,
      }).sort({
        createdAt: 1,
      });

    res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error(
      "Get playground challenges error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch playground challenges",
      error: error.message,
    });
  }
});

// =====================================================
// CREATE CHALLENGE
// For Postman/admin use
// =====================================================

router.post("/challenges", async (req, res) => {
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
        message:
          "challengeId, title and description are required",
      });
    }

    const existing =
      await PlaygroundChallenge.findOne({
        challengeId,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Challenge already exists",
      });
    }

    const challenge =
      await PlaygroundChallenge.create({
        challengeId,
        title,
        description,
        difficulty:
          difficulty || "Easy",
        language:
          language || "python",
        validationType:
          validationType || "general",
        testCases:
          Array.isArray(testCases)
            ? testCases
            : [],
      });

    res.status(201).json({
      success: true,
      challenge,
    });
  } catch (error) {
    console.error(
      "Create playground challenge error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create playground challenge",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE CHALLENGE
// =====================================================

router.put(
  "/challenges/:challengeId",
  async (req, res) => {
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
          message:
            "title and description are required",
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
            difficulty:
              difficulty || "Easy",
            language:
              language || "python",
            validationType:
              validationType || "general",
            testCases:
              Array.isArray(testCases)
                ? testCases
                : [],
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
      console.error(
        "Update playground challenge error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update playground challenge",
        error: error.message,
      });
    }
  }
);

// =====================================================
// GET USER PROJECTS
// =====================================================

router.get("/projects", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const projects =
      await PlaygroundProject.find({
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
      "Get playground projects error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch playground projects",
      error: error.message,
    });
  }
});

// =====================================================
// SAVE PROJECT
// =====================================================

router.post("/projects", async (req, res) => {
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
        message:
          "userId, title and code are required",
      });
    }

    const project =
      await PlaygroundProject.create({
        userId,
        title,
        description: description || "",
        code,
        language: language || "python",
      });

    res.status(201).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error(
      "Save playground project error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to save playground project",
      error: error.message,
    });
  }
});

// =====================================================
// UPDATE PROJECT
// =====================================================

router.put(
  "/projects/:projectId",
  async (req, res) => {
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
          message:
            "userId, title and code are required",
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
      console.error(
        "Update playground project error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update playground project",
        error: error.message,
      });
    }
  }
);

// =====================================================
// DELETE PROJECT
// =====================================================

router.delete(
  "/projects/:projectId",
  async (req, res) => {
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
        message:
          "Project deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete playground project error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to delete playground project",
      });
    }
  }
);

module.exports = router;