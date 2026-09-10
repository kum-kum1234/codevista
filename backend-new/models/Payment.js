const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    checkoutSessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    paymentIntentId: {
      type: String,
      default: "",
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "inr",
    },

    plan: {
      type: String,
      default: "Premium",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "expired"],
      default: "created",
    },

    stripeCustomerId: {
      type: String,
      default: "",
    },

    stripeEventId: {
      type: String,
      default: "",
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "payments",
  }
);

module.exports =
  mongoose.models.Payment ||
  mongoose.model("Payment", paymentSchema);