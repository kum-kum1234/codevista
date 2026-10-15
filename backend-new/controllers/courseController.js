const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const Profile = require("../models/Profile");
const {
    sendNotificationToUser
} = require("../services/notificationService");


// ============================================================
// SEND COURSE NOTIFICATION
// ============================================================

const notifyCourseUsers = async ({
    type,
    title,
    message,
    courseId
}) => {
    // Off by default so test runs do not spam every user. Set
    // COURSE_NOTIFICATIONS=true in the environment to enable.
    if (process.env.COURSE_NOTIFICATIONS !== "true") {
        return;
    }

    try {
        const profiles = await Profile.find({
            active: true
        }).select("userId");

        await Promise.allSettled(
            profiles
                .filter((profile) => profile.userId)
                .map((profile) =>
                    sendNotificationToUser({
                        userId: profile.userId,
                        type: "course",
                        title,
                        message,
                        link: courseId
                            ? `/courses/${courseId}`
                            : "/courses",
                        data: {
                            courseId: courseId || ""
                        }
                    })
                )
        );

    } catch (error) {
        console.error(
            "Course notification error:",
            error.message
        );
    }
};


// ============================================================
// lessonsCount always reflects the lessons that really exist
// ============================================================

const withLessonCounts = async (courses) => {
    const counts = await Lesson.aggregate([
        { $group: { _id: "$courseId", count: { $sum: 1 } } }
    ]);

    const byCourse = new Map(counts.map((entry) => [entry._id, entry.count]));

    return courses.map((course) => {
        const plain = course.toObject ? course.toObject() : course;
        const actual = byCourse.get(plain.courseId);

        return { ...plain, lessonsCount: actual === undefined ? plain.lessonsCount : actual };
    });
};


// ============================================================
// CREATE COURSE
// ============================================================

const createCourse = async (req, res) => {
    try {
        const course = await Course.create(req.body);

        // Send notification after course is successfully created
        await notifyCourseUsers({
            type: "course",
            title: "New Course Available",
            message: `${course.courseTitle || course.title || "A new course"} is now available on CodeVista.`,
            courseId: course.courseId
        });

        res.status(201).json({
            success: true,
            course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// GET ALL COURSES
// ============================================================

const getCourses = async (req, res) => {
    try {
        const courses = await withLessonCounts(await Course.find());

        res.status(200).json({
            success: true,
            courses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// GET COURSE BY ID
// ============================================================

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findOne({
            courseId: req.params.courseId
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        const [courseWithCount] = await withLessonCounts([course]);

        res.status(200).json({
            success: true,
            course: courseWithCount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// UPDATE COURSE
// ============================================================

const updateCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate(
            {
                courseId: req.params.courseId
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Send notification after course is successfully updated
        await notifyCourseUsers({
            type: "course",
            title: "Course Updated",
            message: `${course.courseTitle || course.title || "A course"} has been updated on CodeVista.`,
            courseId: course.courseId
        });

        res.status(200).json({
            success: true,
            course
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================================
// DELETE COURSE
// ============================================================

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndDelete({
            courseId: req.params.courseId
        });

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found"
            });
        }

        // Send notification after course is successfully deleted
        await notifyCourseUsers({
            type: "course",
            title: "Course Removed",
            message: `${course.courseTitle || course.title || "A course"} has been removed from CodeVista.`,
            courseId: course.courseId
        });

        res.status(200).json({
            success: true,
            message: "Course deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse
};