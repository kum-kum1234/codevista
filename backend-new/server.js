require("dotenv").config();

const cron = require("node-cron");
const { sendWeeklyReport } = require("./services/weeklyReportService");
const Profile = require("./models/Profile");
const connectDB = require("./config/db");

// Single source of truth for routes / middleware (shared with Vercel's api/index.js)
const app = require("./src/app");

connectDB().catch(() => process.exit(1));

// =====================================================
// AUTOMATIC WEEKLY PROGRESS REPORT
// Runs every Monday at 9:00 AM IST
// =====================================================

cron.schedule(
  "0 9 * * 1",
  async () => {
    console.log(
      "📊 Running weekly progress report job..."
    );

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
            result.skipped
              ? "skipped"
              : "sent"
          );
        } catch (error) {
          console.error(
            `Weekly report failed for ${profile.userId}:`,
            error.message
          );
        }
      }

      console.log(
        "✅ Weekly progress report job completed"
      );
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
  console.log(
    `🚀 Server running on port ${PORT}`
  );

  console.log(
    "📅 Weekly progress report scheduler is active"
  );
});