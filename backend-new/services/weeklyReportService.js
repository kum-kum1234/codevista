const WeeklyProgress = require("../models/WeeklyProgress");
const {
  UserAchievement,
} = require("../models/Achievement");

const {
  sendNotificationToUser,
} = require("./notificationService");

// =====================================================
// GET MONDAY OF CURRENT WEEK
// =====================================================

function getWeekStart(date = new Date()) {
  const currentDate = new Date(date);

  currentDate.setHours(
    0,
    0,
    0,
    0
  );

  const day =
    currentDate.getDay();

  const difference =
    day === 0
      ? -6
      : 1 - day;

  currentDate.setDate(
    currentDate.getDate() +
      difference
  );

  return currentDate;
}

// =====================================================
// GET SUNDAY OF CURRENT WEEK
// =====================================================

function getWeekEnd(date = new Date()) {
  const weekStart =
    getWeekStart(date);

  const weekEnd =
    new Date(weekStart);

  weekEnd.setDate(
    weekEnd.getDate() + 6
  );

  weekEnd.setHours(
    23,
    59,
    59,
    999
  );

  return weekEnd;
}

// =====================================================
// WEEK KEY
// Example: 2026-09-07
// =====================================================

function getWeekKey(date = new Date()) {
  const weekStart =
    getWeekStart(date);

  return weekStart
    .toISOString()
    .split("T")[0];
}

// =====================================================
// SNAPSHOT DATA
// =====================================================

function buildSnapshot(stats) {
  return {
    lessonsDone:
      Number(
        stats?.lessonsDone || 0
      ),

    codeRuns:
      Number(
        stats?.codeRuns || 0
      ),

    exercisesDone:
      Number(
        stats?.exercisesDone || 0
      ),

    projectsCreated:
      Number(
        stats?.projectsCreated || 0
      ),

    projectsSaved:
      Number(
        stats?.projectsSaved || 0
      ),

    commentsMade:
      Number(
        stats?.commentsMade || 0
      ),

    currentStreak:
      Number(
        stats?.currentStreak || 0
      ),

    visualArtProjects:
      Number(
        stats?.visualArtProjects || 0
      ),

    gamesCreated:
      Number(
        stats?.gamesCreated || 0
      ),

    dataAnalysisProjects:
      Number(
        stats?.dataAnalysisProjects || 0
      ),

    perfectQuizzes:
      Number(
        stats?.perfectQuizzes || 0
      ),

    collaborations:
      Number(
        stats?.collaborations || 0
      ),

    beginnerCoursesCompleted:
      Number(
        stats?.beginnerCoursesCompleted ||
          0
      ),
  };
}

// =====================================================
// CALCULATE WEEKLY DIFFERENCE
// =====================================================

function calculateDifference(
  current,
  previous
) {
  const fields = [
    "lessonsDone",
    "codeRuns",
    "exercisesDone",
    "projectsCreated",
    "projectsSaved",
    "commentsMade",
    "visualArtProjects",
    "gamesCreated",
    "dataAnalysisProjects",
    "perfectQuizzes",
    "collaborations",
    "beginnerCoursesCompleted",
  ];

  const difference = {};

  fields.forEach(
    (field) => {
      difference[field] =
        Math.max(
          0,
          Number(
            current[field] || 0
          ) -
            Number(
              previous?.[field] || 0
            )
        );
    }
  );

  difference.currentStreak =
    Number(
      current.currentStreak || 0
    );

  return difference;
}

// =====================================================
// CREATE / GET WEEKLY SNAPSHOT
// =====================================================

async function createWeeklySnapshot(
  userId,
  date = new Date()
) {
  const weekStart =
    getWeekStart(date);

  const weekEnd =
    getWeekEnd(date);

  const weekKey =
    getWeekKey(date);

  const stats =
    await UserAchievement.findOne({
      userId,
    });

  const snapshot =
    buildSnapshot(stats);

  const weeklyProgress =
    await WeeklyProgress.findOneAndUpdate(
      {
        userId,
        weekKey,
      },
      {
        $set: {
          userId,
          weekKey,
          weekStart,
          weekEnd,
          ...snapshot,
          active: true,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

  return weeklyProgress;
}

// =====================================================
// GET PREVIOUS WEEK SNAPSHOT
// =====================================================

async function getPreviousWeek(
  userId,
  currentDate = new Date()
) {
  const previousDate =
    new Date(currentDate);

  previousDate.setDate(
    previousDate.getDate() - 7
  );

  const previousWeekKey =
    getWeekKey(previousDate);

  return WeeklyProgress.findOne({
    userId,
    weekKey:
      previousWeekKey,
  });
}

// =====================================================
// BUILD REPORT
// =====================================================

async function buildWeeklyReport(
  userId,
  date = new Date()
) {
  const current =
    await createWeeklySnapshot(
      userId,
      date
    );

  const previous =
    await getPreviousWeek(
      userId,
      date
    );

  const currentData =
    current.toObject();

  const previousData =
    previous
      ? previous.toObject()
      : null;

  const difference =
    calculateDifference(
      currentData,
      previousData
    );

  const totalActivities =
    difference.lessonsDone +
    difference.codeRuns +
    difference.exercisesDone +
    difference.projectsCreated +
    difference.projectsSaved +
    difference.commentsMade +
    difference.visualArtProjects +
    difference.gamesCreated +
    difference.dataAnalysisProjects +
    difference.perfectQuizzes +
    difference.collaborations +
    difference.beginnerCoursesCompleted;

  return {
    userId,

    weekKey:
      current.weekKey,

    weekStart:
      current.weekStart,

    weekEnd:
      current.weekEnd,

    current:
      currentData,

    previous:
      previousData,

    difference,

    totalActivities,
  };
}

// =====================================================
// SEND WEEKLY REPORT NOTIFICATION
// =====================================================

async function sendWeeklyReport(
  userId,
  date = new Date()
) {
  if (!userId) {
    throw new Error(
      "userId is required"
    );
  }

  const report =
    await buildWeeklyReport(
      userId,
      date
    );

  // ---------------------------------------------------
  // CHECK IF THIS WEEK WAS ALREADY NOTIFIED
  // ---------------------------------------------------

  const existingNotification =
    await require("../models/Notification").findOne(
      {
        userId,
        type: "weekly",
        "data.weekKey":
          report.weekKey,
      }
    );

  if (existingNotification) {
    return {
      skipped: true,
      reason:
        "Weekly report already sent",
      report,
    };
  }

  // ---------------------------------------------------
  // CREATE MESSAGE
  // ---------------------------------------------------

  const {
    lessonsDone,
    codeRuns,
    exercisesDone,
    projectsCreated,
  } = report.difference;

  const parts = [];

  if (lessonsDone > 0) {
    parts.push(
      `${lessonsDone} lesson${
        lessonsDone === 1
          ? ""
          : "s"
      }`
    );
  }

  if (codeRuns > 0) {
    parts.push(
      `${codeRuns} code run${
        codeRuns === 1
          ? ""
          : "s"
      }`
    );
  }

  if (exercisesDone > 0) {
    parts.push(
      `${exercisesDone} exercise${
        exercisesDone === 1
          ? ""
          : "s"
      }`
    );
  }

  if (projectsCreated > 0) {
    parts.push(
      `${projectsCreated} project${
        projectsCreated === 1
          ? ""
          : "s"
      }`
    );
  }

  let message;

  if (parts.length > 0) {
    message =
      `This week you completed ${parts.join(
        ", "
      )}. Keep up the great work! 🚀`;
  } else {
    message =
      "You didn't record much learning activity this week. Start a lesson and keep your coding streak going! 🚀";
  }

  // ---------------------------------------------------
  // SEND NOTIFICATION
  // ---------------------------------------------------

  const result =
    await sendNotificationToUser({
      userId,
      type: "weekly",
      title:
        "Weekly Progress Report",
      message,
      link: "/achievements",
      data: {
        weekKey:
          report.weekKey,
        lessonsDone,
        codeRuns,
        exercisesDone,
        projectsCreated,
        totalActivities:
          report.totalActivities,
      },
    });

  return {
    skipped: false,
    result,
    report,
  };
}

module.exports = {
  getWeekStart,
  getWeekEnd,
  getWeekKey,
  createWeeklySnapshot,
  buildWeeklyReport,
  sendWeeklyReport,
};