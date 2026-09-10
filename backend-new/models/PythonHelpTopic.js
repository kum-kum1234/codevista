const mongoose = require("mongoose");

const exampleSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },

    caption: {
      type: String,
      default: "",
      trim: true,
    },

    code: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const pythonHelpTopicSchema = new mongoose.Schema(
  {
    topicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
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

    body: {
      type: String,
      default: "",
    },

    examples: {
      type: [exampleSchema],
      default: [],
    },

    tip: {
      type: String,
      default: "",
    },

    order: {
      type: Number,
      default: 0,
      index: true,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "pythonhelptopics",
  }
);

module.exports = mongoose.model(
  "PythonHelpTopic",
  pythonHelpTopicSchema
);