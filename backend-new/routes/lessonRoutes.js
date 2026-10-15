const express = require("express");

const {
    createLesson,
    getLessons,
    getLessonById,
    getLessonsByCourse,
    updateLesson,
    deleteLesson
} = require("../controllers/lessonController");

const auth = require("../src/middlewares/auth.middleware");
const { requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();


// Create lesson
router.post(
  "/",
  auth,
  requireAdmin,
  createLesson
);


// Get all lessons
router.get("/", getLessons);


// Get lessons belonging to a course
router.get("/course/:courseId", getLessonsByCourse);


// Get one lesson (full content: needs login + access to the lesson)
router.get("/:lessonId", auth, getLessonById);


// Update lesson
router.put(
  "/:lessonId",
  auth,
  requireAdmin,
  updateLesson
);


// Delete lesson
router.delete(
  "/:lessonId",
  auth,
  requireAdmin,
  deleteLesson
);


module.exports = router;