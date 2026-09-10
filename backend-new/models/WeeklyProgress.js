const mongoose = require("mongoose");

const weeklyProgressSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
        index: true,
      },

      weekKey: {
        type: String,
        required: true,
      },

      weekStart: {
        type: Date,
        required: true,
      },

      weekEnd: {
        type: Date,
        required: true,
      },

      lessonsDone: {
        type: Number,
        default: 0,
      },

      codeRuns: {
        type: Number,
        default: 0,
      },

      exercisesDone: {
        type: Number,
        default: 0,
      },

      projectsCreated: {
        type: Number,
        default: 0,
      },

      projectsSaved: {
        type: Number,
        default: 0,
      },

      commentsMade: {
        type: Number,
        default: 0,
      },

      currentStreak: {
        type: Number,
        default: 0,
      },

      visualArtProjects: {
        type: Number,
        default: 0,
      },

      gamesCreated: {
        type: Number,
        default: 0,
      },

      dataAnalysisProjects: {
        type: Number,
        default: 0,
      },

      perfectQuizzes: {
        type: Number,
        default: 0,
      },

      collaborations: {
        type: Number,
        default: 0,
      },

      beginnerCoursesCompleted: {
        type: Number,
        default: 0,
      },

      active: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
      collection: "weeklyprogress",
    }
  );

weeklyProgressSchema.index(
  {
    userId: 1,
    weekKey: 1,
  },
  {
    unique: true,
  }
);

module.exports =
  mongoose.models.WeeklyProgress ||
  mongoose.model(
    "WeeklyProgress",
    weeklyProgressSchema
  );