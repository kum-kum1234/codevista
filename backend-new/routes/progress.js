const express = require("express");
const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router = express.Router();

const Profile = require("../models/Profile");
const Lesson = require("../models/Lesson");
const LessonProgress = require("../models/LessonProgress");
const CourseEnrollment = require("../models/CourseEnrollment");
const { trackActivity } = require("../services/activityService");

const LESSON_XP = 20;

const markStarted = (userId, courseId) =>
  CourseEnrollment.updateOne(
    { userId, courseId },
    { $setOnInsert: { userId, courseId, startedAt: new Date() } },
    { upsert: true }
  );

// Completed / total lessons of one course for one user.
async function getCourseProgress(userId, courseId) {
  const lessons = await Lesson.find({ courseId }).select("lessonId");
  const lessonIds = lessons.map((lesson) => lesson.lessonId);

  const done = lessonIds.length
    ? await LessonProgress.find({
        userId,
        lessonId: { $in: lessonIds },
      }).select("lessonId")
    : [];

  const completedLessonIds = done.map((entry) => entry.lessonId);

  return {
    courseId,
    totalLessons: lessonIds.length,
    completedLessons: completedLessonIds.length,
    percent: lessonIds.length
      ? Math.round((completedLessonIds.length / lessonIds.length) * 100)
      : 0,
    completedLessonIds,
  };
}

// =====================================================
// MARK A LESSON COMPLETE
// POST /api/progress/lesson-complete   { lessonId }
// =====================================================

router.post("/lesson-complete", auth, requireOwner, async (req, res) => {
  try {
     const userId = req.user.id;
     const { lessonId } = req.body;
    if (!lessonId) {
      return res.status(400).json({
        success: false,
        message: "lessonId is required",
      });
    }

    const lesson = await Lesson.findOne({ lessonId }).select("courseId");

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    await markStarted(userId, lesson.courseId);

    const saved = await LessonProgress.updateOne(
      { userId, lessonId },
      {
        $setOnInsert: {
          userId,
          lessonId,
          courseId: lesson.courseId,
          completedAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Only the first completion of a lesson counts towards achievements.
    if (saved.upsertedCount > 0) {
      await trackActivity(userId, {
        inc: { lessonsDone: 1 },
        xp: LESSON_XP,
      });
    }

    return res.status(200).json({
      success: true,
      progress: await getCourseProgress(userId, lesson.courseId),
    });
  } catch (error) {
    console.error("Lesson complete error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save lesson progress",
    });
  }
});

// =====================================================
// MARK A COURSE AS STARTED
// POST /api/progress/course-start   { courseId }
// =====================================================

router.post("/course-start", auth, requireOwner, async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    if (!(await Lesson.exists({ courseId }))) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    await markStarted(userId, courseId);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Course start error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save course start",
    });
  }
});

// =====================================================
// STATUS OF EVERY COURSE FOR ONE USER (single request)
// GET /api/progress/:userId/courses
// =====================================================

router.get("/:userId/courses", auth, requireOwner, async (req, res) => {
  try {
    const { userId } = req.params;

    const [totals, completed, enrolled] = await Promise.all([
      Lesson.aggregate([{ $group: { _id: "$courseId", total: { $sum: 1 } } }]),
      LessonProgress.aggregate([
        { $match: { userId } },
        { $group: { _id: "$courseId", done: { $sum: 1 } } },
      ]),
      CourseEnrollment.find({ userId }).select("courseId"),
    ]);

    const doneBy = new Map(completed.map((e) => [e._id, e.done]));
    const startedIds = new Set(enrolled.map((e) => e.courseId));

    const statuses = {};

    for (const { _id: courseId, total } of totals) {
      const done = Math.min(doneBy.get(courseId) || 0, total);

      statuses[courseId] = {
        totalLessons: total,
        completedLessons: done,
        status:
          total > 0 && done >= total
            ? "Completed"
            : done > 0 || startedIds.has(courseId)
            ? "In Progress"
            : "Not Started",
      };
    }

    // Started courses that have no lessons yet still count as started.
    for (const courseId of startedIds) {
      if (!statuses[courseId]) {
        statuses[courseId] = {
          totalLessons: 0,
          completedLessons: 0,
          status: "In Progress",
        };
      }
    }

    return res.status(200).json({ success: true, statuses });
  } catch (error) {
    console.error("Course statuses error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch course statuses",
    });
  }
});

// =====================================================
// COURSE PROGRESS
// GET /api/progress/:userId/course/:courseId
// =====================================================

router.get(
  "/:userId/course/:courseId",
  auth,
  requireOwner,
  async (req, res) => {
    try {
      const { userId, courseId } = req.params;

      return res.status(200).json({
        success: true,
        progress: await getCourseProgress(userId, courseId),
      });
    } catch (error) {
      console.error("Course progress error:", error);

      return res.status(500).json({
        success: false,
        message: "Failed to fetch course progress",
      });
    }
  }
);

// =====================================================
// GET USER PROGRESS
// GET /api/progress/:userId
// =====================================================

router.get(
  "/:userId",
  auth,
  requireOwner,
  async (req, res) => {
  try {
    const { userId } = req.params;

    // -------------------------------------------------
    // VALIDATE USER ID
    // -------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required.",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const profile = await Profile.findOne({
      userId: userId,
    });

    if (!profile) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    // -------------------------------------------------
    // RETURN PROGRESS
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      progress: {
        overallProgress: profile.overallProgress || 0,
        achievementsCount: profile.achievementsCount || 0,
        streak: profile.streak || 0,
      },
    });

  } catch (error) {
    console.error(
      "========== PROGRESS FETCH ERROR =========="
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      error: "Failed to fetch progress.",
    });
  }
});

module.exports = router;