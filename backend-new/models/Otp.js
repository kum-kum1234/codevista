const mongoose = require("mongoose");

// One pending login code per phone number. Stored in MongoDB (not in memory)
// so "send" and "verify" work even when they hit different serverless instances.
// Mongo's TTL index removes expired documents automatically.
const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // HMAC of the code - the plain code is never stored.
    codeHash: {
      type: String,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
    collection: "otps",
  }
);

module.exports = mongoose.models.Otp || mongoose.model("Otp", otpSchema);
