const express = require("express");

const {
    createLesson,
    getLessons,
    getLessonById,
    getLessonsByCourse,
    updateLesson,
    deleteLesson
} = require("../controllers/lessonController");

const router = express.Router();


// Create lesson
router.post("/", createLesson);


// Get all lessons
router.get("/", getLessons);


// Get lessons belonging to a course
router.get("/course/:courseId", getLessonsByCourse);


// Get one lesson
router.get("/:lessonId", getLessonById);


// Update lesson
router.put("/:lessonId", updateLesson);


// Delete lesson
router.delete("/:lessonId", deleteLesson);


module.exports = router;