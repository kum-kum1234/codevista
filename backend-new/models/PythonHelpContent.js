const mongoose = require("mongoose");

/*
 * Category Schema
 * Categories are stored inside the PythonHelpContent document.
 */
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    order: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: true,
  }
);

/*
 * Python Help Content Schema
 */
const pythonHelpContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "default",
      index: true,
    },

    header: {
      eyebrow: {
        type: String,
        default: "RESOURCES",
      },

      title: {
        type: String,
        default: "Python Help Guide",
      },

      description: {
        type: String,
        default: "",
      },
    },

    intro: {
      title: {
        type: String,
        default: "Quick Introduction to Python",
      },

      paragraphs: {
        type: [String],
        default: [],
      },
    },

    /*
     * Categories are stored here.
     *
     * Example:
     * [
     *   {
     *     name: "Python Basics",
     *     description: "Learn Python fundamentals",
     *     order: 1,
     *     active: true
     *   }
     * ]
     */
    categories: {
      type: [categorySchema],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: "pythonhelpcontents",
  }
);

/*
 * Prevent Mongoose OverwriteModelError
 * when the server reloads with nodemon.
 */
module.exports =
  mongoose.models.PythonHelpContent ||
  mongoose.model(
    "PythonHelpContent",
    pythonHelpContentSchema
  );