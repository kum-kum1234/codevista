const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String,
      default: "BookOpen",
    },

    order: {
      type: Number,
      default: 0,
    },
  },
  { _id: false }
);

const noteSubjectSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    subjects: {
      type: [subjectSchema],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "notesubjects",
  }
);

module.exports =
  mongoose.models.NoteSubject ||
  mongoose.model("NoteSubject", noteSubjectSchema);
