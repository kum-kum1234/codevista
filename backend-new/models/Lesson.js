const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        lessonId: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        courseId: {
            type: String,
            required: true,
            trim: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        duration: {
            type: String,
            default: ""
        },

        type: {
            type: String,
            default: "Video"
        },

        order: {
            type: Number,
            required: true
        },

        locked: {
            type: Boolean,
            default: true
        },

        path: {
            type: String,
            default: ""
        },

        video: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        learn: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },

        exercises: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },

        codeLab: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        whatYouLearned: {
            type: [String],
            default: []
        },

        nextLesson: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        resources: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Lesson", lessonSchema);