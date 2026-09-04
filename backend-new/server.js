const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const authRoutes = require("./routes/auth");

// NEW: Playground routes
const playgroundRoutes = require("./routes/playgroundRoutes");

// NEW: Learner Dashboard routes
//const learnerDashboardRoutes = require("./routes/learnerDashboard");

const app = express();


// =====================================================
// DATABASE CONNECTION
// =====================================================

connectDB();


// =====================================================
// MIDDLEWARE
// =====================================================

app.use(cors());

app.use(express.json());


// =====================================================
// API ROUTES
// =====================================================

// Course APIs
app.use("/api/courses", courseRoutes);


// Lesson APIs
app.use("/api/lessons", lessonRoutes);


// Authentication APIs
app.use("/api/auth", authRoutes);


// Playground APIs
app.use("/api/playground", playgroundRoutes);


// Learner Dashboard APIs
//app.use("/api/dashboard", learnerDashboardRoutes);


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
// SERVER
// =====================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});