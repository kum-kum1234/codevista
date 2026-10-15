const mongoose = require("mongoose");

/* =====================================================
   NOTIFICATION SCHEMA
   ===================================================== */

const notificationSchema = new mongoose.Schema(
  {
    courseUpdates: {
      type: Boolean,
      default: true,
    },

    achievements: {
      type: Boolean,
      default: true,
    },

    weeklyReport: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
  }
);

/* =====================================================
   SUBSCRIPTION SCHEMA
   ===================================================== */

const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      default: "Free",
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    benefits: {
      type: [String],
      default: [],
    },

    price: {
      type: Number,
      default: 0,
    },

    period: {
      type: String,
      default: "per annum",
      trim: true,
    },

    status: {
      type: String,
      default: "active",
      trim: true,
    },
  },
  {
    _id: false,
  }
);

/* =====================================================
   PROFILE SCHEMA
   ===================================================== */

const profileSchema = new mongoose.Schema(
  {
    /* ===================================================
       USER ID
       =================================================== */

    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    /* ===================================================
       BASIC USER INFORMATION
       =================================================== */

    name: {
      type: String,
      default: "Guest",
      trim: true,
    },

    // No default: a missing email/phone stays absent instead of "",
    // so the partial unique indexes below only cover real values.
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    provider: {
      type: String,
      enum: ["email", "phone", "google"],
      default: "email",
      trim: true,
    },

    /* ===================================================
       PASSWORD

       Password is NEVER stored directly.

       Only bcrypt hash is stored.

       IMPORTANT:
       select: false means passwordHash is hidden from
       normal MongoDB queries.

       Login must use:
       .select("+passwordHash")
       =================================================== */

    passwordHash: {
      type: String,
      default: null,
      select: false,
    },

    /* ===================================================
       SESSION REVOCATION

       Embedded in every user token. Logout increments it,
       which invalidates all tokens issued before.
       =================================================== */

    tokenVersion: {
      type: Number,
      default: 0,
    },

    /* ===================================================
       ACCOUNT TYPE
       =================================================== */

    accountType: {
      type: String,
      enum: ["Free", "CoursePremium", "Premium"],
      default: "Free",
      trim: true,
    },

    /* ===================================================
       INDIVIDUAL COURSE ACCESS
       =================================================== */

    premiumCourses: {
      type: [String],
      default: [],
    },

    /* ===================================================
       LEARNING PROGRESS
       =================================================== */

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

    /* ===================================================
       NOTIFICATIONS
       =================================================== */

    notifications: {
      type: notificationSchema,
      default: () => ({}),
    },

    /* ===================================================
       SUBSCRIPTION
       =================================================== */

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

    /* ===================================================
       ACCOUNT STATUS
       =================================================== */

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },

  /* =====================================================
     SCHEMA OPTIONS
     ===================================================== */

  {
    timestamps: true,
    collection: "profiles",
  }
);

/* =====================================================
   UNIQUENESS (only for real, non-empty values)
   ===================================================== */

profileSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $type: "string", $gt: "" } },
  }
);

profileSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $type: "string", $gt: "" },
      active: true,
    },
  }
);

/* =====================================================
   EXPORT MODEL
   ===================================================== */

module.exports =
  mongoose.models.Profile ||
  mongoose.model("Profile", profileSchema);