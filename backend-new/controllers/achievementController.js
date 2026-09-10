const {
  Achievement,
  UserAchievement,
  UnlockedAchievement,
} = require("../models/Achievement");

const {
  sendNotificationToUser,
} = require("../services/notificationService");

// =====================================================
// HELPER
// =====================================================

function getMetricValue(stats, criteriaType) {
  const metricMap = {
    lessonsDone: stats.lessonsDone,
    codeRuns: stats.codeRuns,
    exercisesDone: stats.exercisesDone,
    projectsCreated: stats.projectsCreated,
    projectsSaved: stats.projectsSaved,
    commentsMade: stats.commentsMade,
    currentStreak: stats.currentStreak,
    visualArtProjects: stats.visualArtProjects,
    gamesCreated: stats.gamesCreated,
    dataAnalysisProjects:
      stats.dataAnalysisProjects,
    perfectQuizzes: stats.perfectQuizzes,
    collaborations: stats.collaborations,
    beginnerCoursesCompleted:
      stats.beginnerCoursesCompleted,
  };

  return Number(
    metricMap[criteriaType] || 0
  );
}

// =====================================================
// GET ALL ACTIVE ACHIEVEMENTS AND BADGES
// =====================================================

const getAchievements = async (req, res) => {
  try {
    const achievements =
      await Achievement.find({
        active: true,
      }).sort({
        sortOrder: 1,
        createdAt: 1,
      });

    res.status(200).json({
      success: true,
      achievements,
    });
  } catch (error) {
    console.error(
      "Get achievements error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch achievements",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE ACHIEVEMENT / BADGE
// For Postman/admin use
// =====================================================

const createAchievement = async (
  req,
  res
) => {
  try {
    const {
      achievementId,
      title,
      description,
      rarity,
      type,
      category,
      icon,
      criteriaType,
      criteriaValue,
      active,
      sortOrder,
    } = req.body;

    if (
      !achievementId ||
      !title ||
      !description ||
      !rarity ||
      !type ||
      !criteriaType ||
      criteriaValue === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "achievementId, title, description, rarity, type, criteriaType and criteriaValue are required",
      });
    }

    const existing =
      await Achievement.findOne({
        achievementId,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "Achievement already exists",
      });
    }

    const achievement =
      await Achievement.create({
        achievementId,
        title,
        description,
        rarity,
        type,
        category:
          category || "general",
        icon: icon || "award",
        criteriaType,
        criteriaValue,
        active:
          typeof active === "boolean"
            ? active
            : true,
        sortOrder:
          Number.isFinite(sortOrder)
            ? sortOrder
            : 0,
      });

    res.status(201).json({
      success: true,
      achievement,
    });
  } catch (error) {
    console.error(
      "Create achievement error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create achievement",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE ACHIEVEMENT / BADGE
// =====================================================

const updateAchievement = async (
  req,
  res
) => {
  try {
    const { achievementId } =
      req.params;

    const {
      title,
      description,
      rarity,
      type,
      category,
      icon,
      criteriaType,
      criteriaValue,
      active,
      sortOrder,
    } = req.body;

    const achievement =
      await Achievement.findOneAndUpdate(
        {
          achievementId,
        },
        {
          title,
          description,
          rarity,
          type,
          category,
          icon,
          criteriaType,
          criteriaValue,
          active,
          sortOrder,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message:
          "Achievement not found",
      });
    }

    res.status(200).json({
      success: true,
      achievement,
    });
  } catch (error) {
    console.error(
      "Update achievement error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update achievement",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER STATISTICS
// =====================================================

const getUserStats = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    let stats =
      await UserAchievement.findOne({
        userId,
      });

    if (!stats) {
      stats =
        await UserAchievement.create({
          userId,
        });
    }

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Get user achievement stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch user achievement stats",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE USER STATISTICS
// =====================================================

const updateUserStats = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const allowedFields = [
      "lessonsDone",
      "codeRuns",
      "exercisesDone",
      "projectsCreated",
      "projectsSaved",
      "commentsMade",
      "currentStreak",
      "visualArtProjects",
      "gamesCreated",
      "dataAnalysisProjects",
      "perfectQuizzes",
      "collaborations",
      "beginnerCoursesCompleted",
      "lastActive",
    ];

    const updateData = {};

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !== undefined
        ) {
          updateData[field] =
            req.body[field];
        }
      }
    );

    updateData.lastActive =
      req.body.lastActive ||
      new Date();

    const stats =
      await UserAchievement.findOneAndUpdate(
        {
          userId,
        },
        {
          $set: updateData,
        },
        {
          new: true,
          upsert: true,
          runValidators: true,
          setDefaultsOnInsert: true,
        }
      );

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Update user achievement stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update user achievement stats",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER ACHIEVEMENTS
// Calculates unlocked state from MongoDB data
// =====================================================

const getUserAchievements = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    let stats =
      await UserAchievement.findOne({
        userId,
      });

    if (!stats) {
      stats =
        await UserAchievement.create({
          userId,
        });
    }

    const definitions =
      await Achievement.find({
        active: true,
      }).sort({
        sortOrder: 1,
        createdAt: 1,
      });

    const unlockedRecords =
      await UnlockedAchievement.find({
        userId,
      });

    const unlockedIds =
      new Set(
        unlockedRecords.map(
          (item) =>
            item.achievementId
        )
      );

    const result = [];

    for (const achievement of definitions) {
      const currentValue =
        getMetricValue(
          stats,
          achievement.criteriaType
        );

      const unlocked =
        currentValue >=
        achievement.criteriaValue;

      // =====================================================
      // NEW UNLOCK
      // =====================================================

      if (
        unlocked &&
        !unlockedIds.has(
          achievement.achievementId
        )
      ) {
        try {
          // Create unlock record
          await UnlockedAchievement.create({
            userId,
            achievementId:
              achievement.achievementId,
          });

          // =====================================================
          // SEND NOTIFICATION
          // =====================================================

          try {
            const notificationTitle =
              achievement.type === "badge"
                ? "Badge Earned"
                : "Achievement Unlocked";

            const notificationMessage =
              achievement.type === "badge"
                ? `${achievement.title} badge has been earned!`
                : `${achievement.title} has been unlocked!`;

            await sendNotificationToUser({
              userId,
              type: "achievement",
              title: notificationTitle,
              message:
                notificationMessage,
              link: "/achievements",
              data: {
                achievementId:
                  achievement.achievementId,
                achievementType:
                  achievement.type,
              },
            });

            console.log(
              `Achievement notification sent: ${achievement.title}`
            );
          } catch (notificationError) {
            console.error(
              "Achievement notification error:",
              notificationError.message
            );
          }
        } catch (unlockError) {
          // Duplicate unlock records are ignored
          if (
            unlockError?.code !== 11000
          ) {
            console.error(
              "Create unlocked achievement error:",
              unlockError.message
            );
          }
        }

        unlockedIds.add(
          achievement.achievementId
        );
      }

      result.push({
        ...achievement.toObject(),
        currentValue,
        unlocked:
          unlocked ||
          unlockedIds.has(
            achievement.achievementId
          ),
      });
    }

    const achievements =
      result.filter(
        (item) =>
          item.type ===
          "achievement"
      );

    const badges =
      result.filter(
        (item) =>
          item.type === "badge"
      );

    const unlockedCount =
      result.filter(
        (item) => item.unlocked
      ).length;

    const totalCount =
      result.length;

    const donePercentage =
      totalCount === 0
        ? 0
        : Math.round(
            (unlockedCount /
              totalCount) *
              100
          );

    res.status(200).json({
      success: true,
      stats,
      achievements,
      badges,
      summary: {
        unlocked: unlockedCount,
        total: totalCount,
        badges: badges.filter(
          (item) => item.unlocked
        ).length,
        donePercentage,
        lessonsDone:
          stats.lessonsDone,
        codeRuns:
          stats.codeRuns,
        exercisesDone:
          stats.exercisesDone,
        lastActive:
          stats.lastActive,
      },
    });
  } catch (error) {
    console.error(
      "Get user achievements error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch user achievements",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER UNLOCKED ACHIEVEMENTS
// =====================================================

const getUnlockedAchievements =
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

      const unlocked =
        await UnlockedAchievement
          .find({
            userId,
          })
          .sort({
            unlockedAt: -1,
          });

      res.status(200).json({
        success: true,
        unlocked,
      });
    } catch (error) {
      console.error(
        "Get unlocked achievements error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch unlocked achievements",
        error: error.message,
      });
    }
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getAchievements,
  createAchievement,
  updateAchievement,
  getUserStats,
  updateUserStats,
  getUserAchievements,
  getUnlockedAchievements,
};