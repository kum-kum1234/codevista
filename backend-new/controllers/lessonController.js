const Lesson = require("../models/Lesson");


// CREATE LESSON
const createLesson = async (req, res) => {
    try {
        const lesson = await Lesson.create(req.body);

        res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            lesson
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL LESSONS
const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find().sort({ order: 1 });

        res.status(200).json({
            success: true,
            lessons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SINGLE LESSON
const getLessonById = async (req, res) => {
    try {
        const lesson = await Lesson.findOne({
            lessonId: req.params.lessonId
        });

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        res.status(200).json({
            success: true,
            lesson
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET LESSONS OF A COURSE
const getLessonsByCourse = async (req, res) => {
    try {
        const lessons = await Lesson.find({
            courseId: req.params.courseId
        }).sort({ order: 1 });

        res.status(200).json({
            success: true,
            lessons
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE LESSON
const updateLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findOneAndUpdate(
            {
                lessonId: req.params.lessonId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lesson updated successfully",
            lesson
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE LESSON
const deleteLesson = async (req, res) => {
    try {
        const lesson = await Lesson.findOneAndDelete({
            lessonId: req.params.lessonId
        });

        if (!lesson) {
            return res.status(404).json({
                success: false,
                message: "Lesson not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Lesson deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createLesson,
    getLessons,
    getLessonById,
    getLessonsByCourse,
    updateLesson,
    deleteLesson
};