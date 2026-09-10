const mongoose = require("mongoose");

// =====================================================
// TURTLE TEMPLATE SCHEMA
// =====================================================

const turtleTemplateSchema = new mongoose.Schema(
  {
    templateId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
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
// TURTLE SETTINGS SCHEMA
// =====================================================

const turtleSettingsSchema = new mongoose.Schema(
  {
    settingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    swatches: {
      type: [String],
      default: [],
    },

    defaultPenColor: {
      type: String,
      default: "#8B5CF6",
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
// TURTLE PROJECT SCHEMA
// =====================================================

const turtleProjectSchema = new mongoose.Schema(
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

    penColor: {
      type: String,
      default: "#8B5CF6",
    },

    templateName: {
      type: String,
      default: "",
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
// MODELS
// =====================================================

const TurtleTemplate =
  mongoose.models.TurtleTemplate ||
  mongoose.model(
    "TurtleTemplate",
    turtleTemplateSchema
  );

const TurtleSettings =
  mongoose.models.TurtleSettings ||
  mongoose.model(
    "TurtleSettings",
    turtleSettingsSchema
  );

const TurtleProject =
  mongoose.models.TurtleProject ||
  mongoose.model(
    "TurtleProject",
    turtleProjectSchema
  );

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  TurtleTemplate,
  TurtleSettings,
  TurtleProject,
};