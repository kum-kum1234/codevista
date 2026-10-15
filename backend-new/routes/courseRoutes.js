const express = require("express");

const {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
} = require("../controllers/courseController");

const auth = require("../src/middlewares/auth.middleware");
const { requireAdmin } = require("../src/middlewares/access.middleware");

const router = express.Router();

router.post(
  "/",
  auth,
  requireAdmin,
  createCourse
);

router.get("/", getCourses);

router.get("/:courseId", getCourseById);

router.put(
  "/:courseId",
  auth,
  requireAdmin,
  updateCourse
);

router.delete(
  "/:courseId",
  auth,
  requireAdmin,
  deleteCourse
);

module.exports = router;