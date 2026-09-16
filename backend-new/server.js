const cron = require("node-cron");
const { sendWeeklyReport } = require("./services/weeklyReportService");
const Profile = require("./models/Profile");

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const timetableRoutes = require("./routes/timetableRoutes");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const achievementRoutes = require("./routes/achievementRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const turtleStudioRoutes = require("./routes/turtleStudioRoutes");
const playgroundRoutes = require("./routes/playgroundRoutes");
const communityRoutes = require("./routes/communityRoutes");
const noteRoutes = require("./routes/noteRoutes");
const noteSubjectRoutes = require("./routes/noteSubjectRoutes");
const codeTogetherRoutes = require("./routes/codeTogetherRoutes");
const helpRoutes = require("./routes/helpRoutes");
const pythonHelpRoutes = require("./routes/pythonHelpRoutes");
const profileRoutes = require("./routes/profileRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const weeklyReportRoutes = require("./routes/weeklyReportRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const paymentController = require("./controllers/paymentController");
const coursePurchaseRoutes = require("./routes/coursePurchaseRoutes");
//const aiMentorRoutes = require("./routes/aiMentor");
const app = express();


// =====================================================
// DATABASE CONNECTION
// =====================================================

connectDB();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());


// =====================================================
// STRIPE WEBHOOK
// IMPORTANT:
// This MUST come BEFORE express.json()
// because Stripe signature verification requires
// the original raw request body.
// =====================================================

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.handleStripeWebhook
);


// =====================================================
// NORMAL JSON MIDDLEWARE
// =====================================================

app.use(express.json());


// =====================================================
// API ROUTES
// =====================================================

// Weekly Progress Report APIs
app.use("/api/weekly-report", weeklyReportRoutes);
app.use(
  "/api/course-purchases",
  coursePurchaseRoutes
);
// Course APIs
app.use("/api/courses", courseRoutes);

// Community APIs
app.use("/api/community", communityRoutes);

// Achievement APIs
app.use("/api/achievements", achievementRoutes);

// Payment APIs
app.use("/api/payments", paymentRoutes);

// Lesson APIs
app.use("/api/lessons", lessonRoutes);
// AI Mentor APIs
//app.use("/api/ai", aiMentorRoutes);
// Code Together APIs
app.use("/api/code-together", codeTogetherRoutes);

// Help APIs
app.use("/api/help", helpRoutes);

// Timetable APIs
app.use("/api/timetable", timetableRoutes);

// Authentication APIs
app.use("/api/auth", authRoutes);

// Turtle Studio APIs
app.use("/api/turtle-studio", turtleStudioRoutes);

// Notification APIs
app.use("/api/notifications", notificationRoutes);

// Notes APIs
app.use("/api/notes", noteRoutes);

// Note Subject APIs
app.use("/api/note-subjects", noteSubjectRoutes);

// Playground APIs
app.use("/api/playground", playgroundRoutes);

// Python Help APIs
app.use("/api/python-help", pythonHelpRoutes);

// Profile APIs
app.use("/api/profile", profileRoutes);


// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Backend API is running",
  });
});


// =====================================================
// AUTOMATIC WEEKLY PROGRESS REPORT
// Runs every Monday at 9:00 AM IST
// =====================================================

cron.schedule(
  "0 9 * * 1",
  async () => {
    console.log("📊 Running weekly progress report job...");

    try {
      const profiles = await Profile.find({
        active: true,
      }).select("userId");

      for (const profile of profiles) {
        if (!profile.userId) {
          continue;
        }

        try {
          const result = await sendWeeklyReport(
            profile.userId,
            new Date()
          );

          console.log(
            `Weekly report for ${profile.userId}:`,
            result.skipped ? "skipped" : "sent"
          );
        } catch (error) {
          console.error(
            `Weekly report failed for ${profile.userId}:`,
            error.message
          );
        }
      }

      console.log("✅ Weekly progress report job completed");
    } catch (error) {
      console.error(
        "❌ Weekly progress report job failed:",
        error.message
      );
    }
  },
  {
    timezone: "Asia/Kolkata",
  }
);


// =====================================================
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("📅 Weekly progress report scheduler is active");
});