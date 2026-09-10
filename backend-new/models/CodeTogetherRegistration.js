const mongoose = require("mongoose");

const codeTogetherRegistrationSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    dateKey: {
      type: String,
      required: true,
      trim: true,
    },

    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: true,
      min: 5,
      max: 18,
    },

    grade: {
      type: String,
      required: true,
      trim: true,
    },

    parentContact: {
      type: String,
      required: true,
      trim: true,
    },

    experience: {
      type: String,
      required: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "codetogetherregistrations",
  }
);

codeTogetherRegistrationSchema.index(
  { userId: 1, dateKey: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "CodeTogetherRegistration",
  codeTogetherRegistrationSchema
);