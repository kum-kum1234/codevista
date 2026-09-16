const express = require("express");
const cors = require("cors");

const timetableRoutes = require("../routes/timetableRoutes");
const authRoutes = require("../routes/auth");
const achievementRoutes = require("../routes/achievementRoutes");
const courseRoutes = require("../routes/courseRoutes");
const lessonRoutes = require("../routes/lessonRoutes");
const turtleStudioRoutes = require("../routes/turtleStudioRoutes");
const playgroundRoutes = require("../routes/playgroundRoutes");
const communityRoutes = require("../routes/communityRoutes");
const noteRoutes = require("../routes/noteRoutes");
const noteSubjectRoutes = require("../routes/noteSubjectRoutes");
const codeTogetherRoutes = require("../routes/codeTogetherRoutes");
const helpRoutes = require("../routes/helpRoutes");
const pythonHelpRoutes = require("../routes/pythonHelpRoutes");
const profileRoutes = require("../routes/profileRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const weeklyReportRoutes = require("../routes/weeklyReportRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const paymentController = require("../controllers/paymentController");
const coursePurchaseRoutes = require("../routes/coursePurchaseRoutes");

const app = express();

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

// =====================================================
// STRIPE WEBHOOK
// IMPORTANT: Must come before express.json()
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
app.use(express.urlencoded({ extended: true }));

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/weekly-report", weeklyReportRoutes);

app.use(
    "/api/course-purchases",
    coursePurchaseRoutes
);

app.use("/api/courses", courseRoutes);

app.use("/api/community", communityRoutes);

app.use("/api/achievements", achievementRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/lessons", lessonRoutes);

// AI Mentor temporarily disabled
// const aiMentorRoutes = require("../routes/aiMentor");
// app.use("/api/ai", aiMentorRoutes);

app.use("/api/code-together", codeTogetherRoutes);

app.use("/api/help", helpRoutes);

app.use("/api/timetable", timetableRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/turtle-studio", turtleStudioRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/notes", noteRoutes);

app.use("/api/note-subjects", noteSubjectRoutes);

app.use("/api/playground", playgroundRoutes);

app.use("/api/python-help", pythonHelpRoutes);

app.use("/api/profile", profileRoutes);

// =====================================================
// TEST ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend API is running"
    });
});

// =====================================================
// 404 HANDLER
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((err, req, res, next) => {
    console.error("API Error:", err);

    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

module.exports = app;