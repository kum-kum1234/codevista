const express = require("express");
const router = express.Router();

const Profile = require("../models/Profile");

// =====================================================
// GET USER PROGRESS
// GET /api/progress/:userId
// =====================================================

router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // -------------------------------------------------
    // VALIDATE USER ID
    // -------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        error: "User ID is required.",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

    const profile = await Profile.findOne({
      userId: userId,
    });

    if (!profile) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    // -------------------------------------------------
    // RETURN PROGRESS
    // -------------------------------------------------

    return res.status(200).json({
      success: true,

      progress: {
        overallProgress: profile.overallProgress || 0,
        achievementsCount: profile.achievementsCount || 0,
        streak: profile.streak || 0,
      },
    });

  } catch (error) {
    console.error(
      "========== PROGRESS FETCH ERROR =========="
    );

    console.error(error);

    console.error(
      "=========================================="
    );

    return res.status(500).json({
      error: "Failed to fetch progress.",
    });
  }
});

module.exports = router;