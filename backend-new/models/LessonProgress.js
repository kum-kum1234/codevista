const mongoose = require("mongoose");

// One document per (user, lesson) the user has marked complete.
const lessonProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    courseId: {
      type: String,
      required: true,
      index: true,
    },

    lessonId: {
      type: String,
      required: true,
    },

    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    collection: "lessonprogress",
  }
);

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports =
  mongoose.models.LessonProgress ||
  mongoose.model("LessonProgress", lessonProgressSchema);
