const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "",
      trim: true,
    },

    body: {
      type: String,
      default: "",
    },

    colorIndex: {
      type: Number,
      default: 0,
      min: 0,
    },

    subjectId: {
      type: String,
      default: null,
    },

    pinned: {
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
    collection: "notes",
  }
);

module.exports =
  mongoose.models.Note || mongoose.model("Note", noteSchema);