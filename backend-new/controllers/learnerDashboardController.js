const {
  User,
  Course,
  Module,
  CourseEnrollment,
  Certificate
} = require("../models");


// ============================================================
// GET LEARNER DASHBOARD
// ============================================================

const getLearnerDashboard = async (req, res) => {

  try {

    // ----------------------------------------------------------
    // 1. Get logged-in user ID
    // ----------------------------------------------------------

    const userId =
      req.user?.id ||
      req.user?.userId;

    if (!userId) {

      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });

    }


    // ----------------------------------------------------------
    // 2. Get learner
    // ----------------------------------------------------------

    const user = await User.findByPk(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found"
      });

    }


    // ----------------------------------------------------------
    // 3. Make sure this is a learner
    // ----------------------------------------------------------

    if (
      user.role &&
      user.role !== "Learner"
    ) {

      return res.status(403).json({
        success: false,
        message: "Learner access required"
      });

    }


    // ----------------------------------------------------------
    // 4. Get all published courses
    // ----------------------------------------------------------

    let courses = [];

    try {

      courses = await Course.findAll({
        where: {
          isPublished: true
        },
        order: [
          ["createdAt", "DESC"]
        ]
      });

    } catch (error) {

      console.error(
        "Course fetch error:",
        error.message
      );

      // Some older Course schemas may not have
      // isPublished. Try fetching courses without it.

      courses = await Course.findAll({
        order: [
          ["createdAt", "DESC"]
        ]
      });

    }


    // ----------------------------------------------------------
    // 5. Get learner enrollments
    // ----------------------------------------------------------

    let enrollments = [];

    try {

      enrollments =
        await CourseEnrollment.findAll({
          where: {
            userId
          }
        });

    } catch (error) {

      console.error(
        "Enrollment fetch error:",
        error.message
      );

      enrollments = [];

    }


    // ----------------------------------------------------------
    // 6. Get learner certificates
    // ----------------------------------------------------------

    let certificates = [];

    try {

      certificates =
        await Certificate.findAll({
          where: {
            userId
          },
          order: [
            ["createdAt", "DESC"]
          ]
        });

    } catch (error) {

      console.error(
        "Certificate fetch error:",
        error.message
      );

      certificates = [];

    }


    // ----------------------------------------------------------
    // 7. Create enrollment map
    // ----------------------------------------------------------

    const enrollmentMap =
      new Map();

    enrollments.forEach(
      (enrollment) => {

        const data =
          enrollment.toJSON();

        if (data.courseId) {

          enrollmentMap.set(
            String(data.courseId),
            data
          );

        }

      }
    );


    // ----------------------------------------------------------
    // 8. Convert courses to dashboard format
    // ----------------------------------------------------------

    const dashboardCourses =
      await Promise.all(

        courses.map(
          async (course) => {

            const courseData =
              course.toJSON();


            // --------------------------------------------------
            // Find enrollment
            // --------------------------------------------------

            const enrollment =
              enrollmentMap.get(
                String(courseData.id)
              );


            // --------------------------------------------------
            // Count modules
            // --------------------------------------------------

            let totalModules = 0;

            try {

              totalModules =
                await Module.count({
                  where: {
                    courseId:
                      courseData.id
                  }
                });

            } catch (error) {

              totalModules =
                Number(
                  courseData.totalModules || 0
                );

            }


            // --------------------------------------------------
            // Calculate progress
            // --------------------------------------------------

            let progress = 0;

            if (enrollment) {

              progress = Number(
                enrollment.progress ??
                enrollment.progressPercentage ??
                enrollment.completionPercentage ??
                enrollment.percentComplete ??
                0
              );

            }


            // Make sure progress stays 0-100

            progress =
              Math.max(
                0,
                Math.min(
                  100,
                  progress
                )
              );


            // --------------------------------------------------
            // Course status
            // --------------------------------------------------

            let status =
              "Not Started";

            if (progress >= 100) {

              status =
                "Completed";

            } else if (progress > 0) {

              status =
                "In Progress";

            }


            // --------------------------------------------------
            // Return course
            // --------------------------------------------------

            return {

              id:
                courseData.id,

              title:
                courseData.courseTitle ||
                courseData.title ||
                "Untitled Course",

              description:
                courseData.description ||
                "",

              category:
                courseData.category ||
                "Programming",

              level:
                courseData.level ||
                courseData.levels ||
                "Beginner",

              thumbnail:
                courseData.thumbnail ||
                null,

              duration:
                courseData.duration ||
                "",

              language:
                courseData.language ||
                "English",

              totalModules,

              completedModules:
                Math.round(
                  totalModules *
                  progress /
                  100
                ),

              progress,

              status,

              enrolled:
                Boolean(enrollment),

              enrollment:
                enrollment || null

            };

          }
        )

      );


    // ----------------------------------------------------------
    // 9. Determine learner courses
    // ----------------------------------------------------------

    const enrolledCourses =
      dashboardCourses.filter(
        (course) =>
          course.enrolled
      );


    const inProgressCourses =
      enrolledCourses.filter(
        (course) =>
          course.progress > 0 &&
          course.progress < 100
      );


    const completedCourses =
      enrolledCourses.filter(
        (course) =>
          course.progress >= 100
      );


    // ----------------------------------------------------------
    // 10. Continue learning course
    // ----------------------------------------------------------

    let continueLearning = null;


    if (inProgressCourses.length > 0) {

      continueLearning =
        inProgressCourses[0];

    } else if (
      enrolledCourses.length > 0
    ) {

      continueLearning =
        enrolledCourses[0];

    }


    // ----------------------------------------------------------
    // 11. Certificate status
    // ----------------------------------------------------------

    const latestCertificate =
      certificates.length > 0
        ? certificates[0]
        : null;


    const certificateEarned =
      certificates.length > 0 ||
      completedCourses.length > 0;


    // ----------------------------------------------------------
    // 12. XP
    // ----------------------------------------------------------

    const xp =
      Number(user.xp || 0);


    // ----------------------------------------------------------
    // 13. Dashboard challenge
    // ----------------------------------------------------------

    /*
      This challenge is currently static.

      The frontend receives it through the API, so later
      you can move challenges into a database without
      changing the dashboard API structure.
    */

    const challenge = {

      id: 1,

      title:
        "A Quick Question: Say Hello!",

      language:
        "Python",

      difficulty:
        "Beginner",

      description:
        "Write a Python program that asks the user for their name and prints a greeting.",

      initialCode:
`# Step 1: Ask the user for their name
name = input("What is your name? ")

# Step 2: Print a greeting
print("Hello", name)`,

      expectedOutput:
        "Hello Kumkum",

      points:
        10

    };


    // ----------------------------------------------------------
    // 14. User dashboard information
    // ----------------------------------------------------------

    const learner = {

      id:
        user.id,

      name:
        user.name,

      email:
        user.email,

      profilePhoto:
        user.profilePhoto || null,

      role:
        user.role,

      xp,

      rating:
        Number(user.rating || 0)

    };


    // ----------------------------------------------------------
    // 15. Statistics
    // ----------------------------------------------------------

    const stats = {

      totalCourses:
        dashboardCourses.length,

      enrolledCourses:
        enrolledCourses.length,

      inProgressCourses:
        inProgressCourses.length,

      completedCourses:
        completedCourses.length,

      certificates:
        certificates.length,

      xp

    };


    // ----------------------------------------------------------
    // 16. Response
    // ----------------------------------------------------------

    return res.status(200).json({

      success: true,

      message:
        "Learner dashboard loaded successfully",

      data: {

        learner,

        stats,

        continueLearning,

        courses:
          dashboardCourses.slice(0, 3),

        allCourses:
          dashboardCourses,

        challenge,

        certificate: {

          earned:
            certificateEarned,

          total:
            certificates.length,

          latest:
            latestCertificate

        }

      }

    });


  } catch (error) {

    console.error(
      "Learner Dashboard Error:",
      error
    );

    return res.status(500).json({

      success: false,

      message:
        "Server error loading learner dashboard",

      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : undefined

    });

  }

};


module.exports = {

  getLearnerDashboard

};