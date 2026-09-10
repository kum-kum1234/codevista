const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    courseUpdates: { type: Boolean, default: true },
    achievements: { type: Boolean, default: true },
    weeklyReport: { type: Boolean, default: true },
  },
  { _id: false }
);

const subscriptionSchema = new mongoose.Schema(
  {
    plan: { type: String, default: "Free" },
    description: { type: String, default: "" },
    benefits: { type: [String], default: [] },
    price: { type: Number, default: 0 },
    period: { type: String, default: "per annum" },
    status: { type: String, default: "active" },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      default: "Guest",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    provider: {
      type: String,
      default: "email",
      trim: true,
    },

    // =====================================================
    // ACCOUNT TYPE
    // Free          = No Premium access
    // CoursePremium = Individual course access
    // Premium       = Complete Premium access
    // =====================================================

    accountType: {
      type: String,
      default: "Free",
      trim: true,
    },

    // =====================================================
    // INDIVIDUAL COURSE ACCESS
    // Used for the ₹1,499 course-specific plan.
    //
    // Example:
    // premiumCourses: ["python-starters"]
    //
    // A Complete Premium user does not need this because
    // accountType === "Premium" already gives access to all.
    // =====================================================

    premiumCourses: {
      type: [String],
      default: [],
    },

    overallProgress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    achievementsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    streak: {
      type: Number,
      default: 0,
      min: 0,
    },

    notifications: {
      type: notificationSchema,
      default: () => ({}),
    },

    subscription: {
      type: subscriptionSchema,
      default: () => ({
        plan: "Free",
        description:
          "Upgrade to Premium for full access to all courses and features",
        benefits: [
          "Access to all courses and updates",
          "Project files and source code downloads",
          "Live coding sessions with instructors",
          "Certificates upon course completion",
        ],
        price: 4999,
        period: "per annum",
        status: "active",
      }),
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "profiles",
  }
);

module.exports =
  mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);