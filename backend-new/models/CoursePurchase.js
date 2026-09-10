const mongoose = require("mongoose");

const coursePurchaseSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    courseId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    courseTitle: {
      type: String,
      default: "",
      trim: true,
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
      default: 1499,
    },

    currency: {
      type: String,
      default: "inr",
      lowercase: true,
    },

    plan: {
      type: String,
      default: "Course",
    },

    status: {
      type: String,
      enum: ["created", "paid", "failed", "expired"],
      default: "created",
      index: true,
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
    collection: "coursepurchases",
  }
);

// Prevent the same user from purchasing the same course twice
coursePurchaseSchema.index(
  { userId: 1, courseId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: "paid",
    },
  }
);

module.exports =
  mongoose.models.CoursePurchase ||
  mongoose.model("CoursePurchase", coursePurchaseSchema);