const mongoose = require("mongoose");

// =====================================================
// ACHIEVEMENT / BADGE DEFINITION SCHEMA
// =====================================================

const achievementSchema = new mongoose.Schema(
  {
    achievementId: {
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

    rarity: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["achievement", "badge"],
      required: true,
    },

    category: {
      type: String,
      default: "general",
      trim: true,
    },

    icon: {
      type: String,
      default: "award",
      trim: true,
    },

    criteriaType: {
      type: String,
      required: true,
      trim: true,
    },

    criteriaValue: {
      type: Number,
      required: true,
      min: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },

    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// USER ACHIEVEMENT PROGRESS SCHEMA
// =====================================================

const userAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    lessonsDone: {
      type: Number,
      default: 0,
      min: 0,
    },

    codeRuns: {
      type: Number,
      default: 0,
      min: 0,
    },

    exercisesDone: {
      type: Number,
      default: 0,
      min: 0,
    },

    projectsCreated: {
      type: Number,
      default: 0,
      min: 0,
    },

    projectsSaved: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentsMade: {
      type: Number,
      default: 0,
      min: 0,
    },

    currentStreak: {
      type: Number,
      default: 0,
      min: 0,
    },

    visualArtProjects: {
      type: Number,
      default: 0,
      min: 0,
    },

    gamesCreated: {
      type: Number,
      default: 0,
      min: 0,
    },

    dataAnalysisProjects: {
      type: Number,
      default: 0,
      min: 0,
    },

    perfectQuizzes: {
      type: Number,
      default: 0,
      min: 0,
    },

    collaborations: {
      type: Number,
      default: 0,
      min: 0,
    },

    beginnerCoursesCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },

    lastActive: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// =====================================================
// USER UNLOCKED ACHIEVEMENT SCHEMA
// =====================================================

const unlockedAchievementSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    achievementId: {
      type: String,
      required: true,
      trim: true,
    },

    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

unlockedAchievementSchema.index(
  {
    userId: 1,
    achievementId: 1,
  },
  {
    unique: true,
  }
);

// =====================================================
// MODELS
// =====================================================

const Achievement =
  mongoose.models.Achievement ||
  mongoose.model(
    "Achievement",
    achievementSchema
  );

const UserAchievement =
  mongoose.models.UserAchievement ||
  mongoose.model(
    "UserAchievement",
    userAchievementSchema
  );

const UnlockedAchievement =
  mongoose.models.UnlockedAchievement ||
  mongoose.model(
    "UnlockedAchievement",
    unlockedAchievementSchema
  );

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  Achievement,
  UserAchievement,
  UnlockedAchievement,
};