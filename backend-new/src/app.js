require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const timetableRoutes = require("../routes/timetableRoutes");
const authRoutes = require("../routes/auth");
const adminRoutes = require("../routes/adminRoutes");
const achievementRoutes = require("../routes/achievementRoutes");
const courseRoutes = require("../routes/courseRoutes");
const lessonRoutes = require("../routes/lessonRoutes");
const turtleStudioRoutes = require("../routes/turtleStudioRoutes");
const playgroundRoutes = require("../routes/playgroundRoutes");
const communityRoutes = require("../routes/communityRoutes");
const noteRoutes = require("../routes/noteRoutes");
const noteSubjectRoutes = require("../routes/noteSubjectRoutes");
//const codeTogetherRoutes = require("../routes/codeTogetherRoutes");
const helpRoutes = require("../routes/helpRoutes");
const pythonHelpRoutes = require("../routes/pythonHelpRoutes");
const profileRoutes = require("../routes/profileRoutes");
const notificationRoutes = require("../routes/notificationRoutes");
const weeklyReportRoutes = require("../routes/weeklyReportRoutes");
const paymentRoutes = require("../routes/paymentRoutes");
const paymentController = require("../controllers/paymentController");
const coursePurchaseRoutes = require("../routes/coursePurchaseRoutes");
const progressRoutes = require("../routes/progress");

const app = express();

// Vercel / reverse proxies: needed for correct client IPs (rate limiting)
app.set("trust proxy", 1);

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(helmet());

// Only the configured frontends may call the API from a browser.
// Set CORS_ORIGINS (comma separated) and/or FRONTEND_URL in the environment.
const allowedOrigins = [
    "http://localhost:5173",
    process.env.FRONTEND_URL,
    ...(process.env.CORS_ORIGINS || "").split(",")
]
    .map((origin) => (origin || "").trim().replace(/[/]+$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin(origin, callback) {
            // non-browser clients (Stripe, curl, server-to-server) send no Origin
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        }
    })
);

// =====================================================
// STRIPE WEBHOOK
// IMPORTANT: Must come before express.json()
// =====================================================

app.post(
    "/api/payments/webhook",
    express.raw({ type: "application/json" }),
    paymentController.handleStripeWebhook
);

// Course purchase webhook (also needs the raw body, so before express.json())
app.use("/api/stripe", require("../routes/stripeWebhook"));

// =====================================================
// NORMAL JSON MIDDLEWARE
// =====================================================

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// =====================================================
// API ROUTES
// =====================================================

app.use("/api/weekly-report", weeklyReportRoutes);

app.use(
    "/api/course-purchases",
    coursePurchaseRoutes
);

app.use("/api/courses", courseRoutes);

app.use("/api/progress", progressRoutes);


app.use("/api/community", communityRoutes);

app.use("/api/achievements", achievementRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/lessons", lessonRoutes);

// AI Mentor temporarily disabled
// const aiMentorRoutes = require("../routes/aiMentor");
// app.use("/api/ai", aiMentorRoutes);

//app.use("/api/code-together", codeTogetherRoutes);

app.use("/api/help", helpRoutes);

app.use("/api/timetable", timetableRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

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

    const status = err.status || 500;

    res.status(status).json({
        success: false,
        message:
            status >= 500 && process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : err.message || "Internal Server Error"
    });
});

module.exports = app;
