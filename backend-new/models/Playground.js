const mongoose = require("mongoose");

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

// =====================================================
// MODELS
// =====================================================

const PlaygroundStarter =
  mongoose.models.PlaygroundStarter ||
  mongoose.model("PlaygroundStarter", starterSchema);

const PlaygroundProject =
  mongoose.models.PlaygroundProject ||
  mongoose.model("PlaygroundProject", projectSchema);

const PlaygroundChallenge =
  mongoose.models.PlaygroundChallenge ||
  mongoose.model("PlaygroundChallenge", challengeSchema);

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  PlaygroundStarter,
  PlaygroundProject,
  PlaygroundChallenge,
};