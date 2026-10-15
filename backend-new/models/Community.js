const mongoose = require("mongoose");

// =====================================================
// COMMUNITY POST
// =====================================================

const communityPostSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    initials: {
      type: String,
      default: "",
      trim: true,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      required: true,
    },

    code: {
      type: String,
      default: "",
    },

    tags: {
      type: [String],
      default: [],
    },

    likes: {
      type: Number,
      default: 0,
      min: 0,
    },

    comments: {
      type: Number,
      default: 0,
      min: 0,
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
// COMMUNITY QUESTION
// =====================================================

const communityQuestionSchema = new mongoose.Schema(
  {
    questionId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    question: {
      type: String,
      required: true,
    },

    answered: {
      type: Boolean,
      default: false,
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
// COMMUNITY USER / PROFILE
// =====================================================

const communityUserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    username: {
      type: String,
      default: "",
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    xp: {
      type: Number,
      default: 0,
      min: 0,
    },

    level: {
      type: Number,
      default: 1,
      min: 1,
    },

    xpToNextLevel: {
      type: Number,
      default: 500,
      min: 0,
    },

    xpProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    posts: {
      type: Number,
      default: 0,
      min: 0,
    },

    streak: {
      type: Number,
      default: 0,
      min: 0,
    },

    lessons: {
      type: Number,
      default: 0,
      min: 0,
    },

    badges: {
      type: Number,
      default: 0,
      min: 0,
    },

    memberSince: {
      type: Date,
      default: Date.now,
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
// COMMUNITY CHALLENGE
// =====================================================

const communityChallengeSchema = new mongoose.Schema(
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

    colorType: {
      type: String,
      default: "purple",
      trim: true,
    },

    daysLeft: {
      type: Number,
      required: true,
      min: 0,
    },

    // When set, daysLeft is computed from this date and expired challenges are hidden.
    endsAt: {
      type: Date,
      default: null,
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
// COMMUNITY SETTINGS
// =====================================================

const communitySettingsSchema = new mongoose.Schema(
  {
    settingId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    filterCategories: {
      type: [String],
      default: [],
    },

    postTypes: {
      type: [String],
      default: [],
    },

    postCategories: {
      type: [String],
      default: [],
    },

    helpGuidelines: {
      type: [String],
      default: [],
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
// MODELS
// =====================================================

const CommunityPost =
  mongoose.models.CommunityPost ||
  mongoose.model(
    "CommunityPost",
    communityPostSchema
  );

const CommunityQuestion =
  mongoose.models.CommunityQuestion ||
  mongoose.model(
    "CommunityQuestion",
    communityQuestionSchema
  );

const CommunityUser =
  mongoose.models.CommunityUser ||
  mongoose.model(
    "CommunityUser",
    communityUserSchema
  );

const CommunityChallenge =
  mongoose.models.CommunityChallenge ||
  mongoose.model(
    "CommunityChallenge",
    communityChallengeSchema
  );

const CommunitySettings =
  mongoose.models.CommunitySettings ||
  mongoose.model(
    "CommunitySettings",
    communitySettingsSchema
  );

module.exports = {
  CommunityPost,
  CommunityQuestion,
  CommunityUser,
  CommunityChallenge,
  CommunitySettings,
};