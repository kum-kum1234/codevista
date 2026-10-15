const mongoose = require("mongoose");

/* =====================================================
   ADMIN SCHEMA
   Admins are separate from learner Profiles. They sign in
   through /api/admin/login and are never listed in .env.
   ===================================================== */

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Never returned by normal queries. Login uses .select("+passwordHash").
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "admins",
  }
);

module.exports =
  mongoose.models.Admin ||
  mongoose.model("Admin", adminSchema);
