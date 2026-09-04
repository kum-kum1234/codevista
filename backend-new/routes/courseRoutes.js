const express = require("express");

const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const router = express.Router();

router.post("/", createCourse);

router.get("/", getCourses);

router.get("/:courseId", getCourseById);

router.put("/:courseId", updateCourse);

router.delete("/:courseId", deleteCourse);

module.exports = router;