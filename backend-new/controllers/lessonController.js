const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Profile = require("../models/Profile");
const CoursePurchase = require("../models/CoursePurchase");
const { isAdminUser } = require("../src/middlewares/access.middleware");

// Lists only expose what a curriculum needs. Video, exercises, code lab and
// resources are returned by GET /lessons/:lessonId after an access check.
const SUMMARY_FIELDS =
    "lessonId courseId title description duration type order locked -_id";

// Free lessons are open to any logged-in user. Locked lessons need Premium,
// a paid purchase of the course, a free course, or an admin account.
const canAccessLesson = async (userId, lesson) => {
    if (lesson.locked === false) return true;
    if (!userId) return false;

    const [profile, purchase, course, admin] = await Promise.all([
        Profile.findOne({ userId, active: true }).select("accountType"),
        CoursePurchase.exists({ userId, courseId: lesson.courseId, status: "paid" }),
        Course.findOne({ courseId: lesson.courseId }).select("premium"),
        isAdminUser(userId)
    ]);

    return (
        profile?.accountType === "Premium" ||
        Boolean(purchase) ||
        course?.premium === false ||
        admin
    );
};


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
        const lessons = await Lesson.find().select(SUMMARY_FIELDS).sort({ order: 1 });

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

        if (!(await canAccessLesson(req.user.id, lesson))) {
            return res.status(403).json({
                success: false,
                code: "LESSON_LOCKED",
                message: "This lesson is locked. Upgrade to Premium or buy the course to unlock it."
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
        }).select(SUMMARY_FIELDS).sort({ order: 1 });

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