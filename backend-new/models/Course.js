const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        courseId: {
            type: String,
            required: true,
            unique: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String,
            required: true
        },

        level: {
            type: String,
            required: true
        },

        lessonsCount: {
            type: Number,
            default: 0
        },

        projectsCount: {
            type: Number,
            default: 0
        },

        hours: {
            type: Number,
            default: 0
        },

        whatYoullLearn: {
            type: [String],
            default: []
        },

        requirements: {
            type: [String],
            default: []
        },

        premium: {
            type: Boolean,
            default: true
        },

        badge: {
            type: String,
            default: "Premium"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Course", courseSchema);