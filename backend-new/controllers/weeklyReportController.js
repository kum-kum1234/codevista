const {
  buildWeeklyReport,
  sendWeeklyReport,
  createWeeklySnapshot,
} = require("../services/weeklyReportService");

// =====================================================
// GET WEEKLY REPORT
// =====================================================

const getWeeklyReport =
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "userId is required",
        });
      }

      const report =
        await buildWeeklyReport(
          userId
        );

      res.status(200).json({
        success: true,
        report,
      });
    } catch (error) {
      console.error(
        "Get weekly report error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to generate weekly report",
        error: error.message,
      });
    }
  };

// =====================================================
// CREATE WEEKLY SNAPSHOT
// =====================================================

const createSnapshot =
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "userId is required",
        });
      }

      const snapshot =
        await createWeeklySnapshot(
          userId
        );

      res.status(200).json({
        success: true,
        snapshot,
      });
    } catch (error) {
      console.error(
        "Create weekly snapshot error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create weekly snapshot",
        error: error.message,
      });
    }
  };

// =====================================================
// TEST WEEKLY NOTIFICATION
// =====================================================

const sendWeeklyReportNotification =
  async (req, res) => {
    try {
      const { userId } =
        req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "userId is required",
        });
      }

      const result =
        await sendWeeklyReport(
          userId
        );

      res.status(200).json({
        success: true,
        result,
      });
    } catch (error) {
      console.error(
        "Send weekly report error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to send weekly report",
        error: error.message,
      });
    }
  };

module.exports = {
  getWeeklyReport,
  createSnapshot,
  sendWeeklyReportNotification,
};