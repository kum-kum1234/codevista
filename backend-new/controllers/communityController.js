const mongoose = require("mongoose");
const {
  CommunityPost,
  CommunityQuestion,
  CommunityUser,
  CommunityChallenge,
  CommunitySettings,
} = require("../models/Community");

const Profile = require("../models/Profile");

const {
  addCommunityXp,
  levelFromXp,
} = require("../services/activityService");

const POST_XP = 10;

// Used when no settings document exists yet, so the page always works.
const DEFAULT_SETTINGS = {
  settingId: "default",
  filterCategories: [
    "All Categories",
    "General",
    "Python Basics",
    "Projects",
    "Help & Questions",
  ],
  postTypes: ["General", "Question", "Project Showcase", "Achievement"],
  postCategories: ["General", "Python Basics", "Projects", "Help & Questions"],
  helpGuidelines: [
    "Describe what you are trying to do",
    "Share the code you have tried",
    "Include the exact error message",
    "Be kind and respectful",
  ],
  active: true,
};

// =====================================================
// GET COMMUNITY FEED
// =====================================================

const getPosts = async (req, res) => {
  try {
    const {
      category,
      search,
    } = req.query;

    const query = {
      active: true,
    };

    if (
      category &&
      category !== "All Categories"
    ) {
      query.category = category;
    }

    if (search?.trim()) {
      const searchValue =
        search.trim();

      query.$or = [
        {
          title: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          content: {
            $regex: searchValue,
            $options: "i",
          },
        },
        {
          tags: {
            $regex: searchValue,
            $options: "i",
          },
        },
      ];
    }

    const posts =
      await CommunityPost.find(query)
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.error(
      "Get community posts error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch community posts",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE POST
// =====================================================

const createPost = async (req, res) => {
  try {
    const {
      userId,
      name,
      initials,
      type,
      category,
      title,
      content,
      code,
      tags,
    } = req.body;

    if (
      !userId ||
      !name ||
      !title ||
      !content ||
      !type ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message:
          "userId, name, type, category, title and content are required",
      });
    }

    const postId =
      `post-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const post =
      await CommunityPost.create({
        postId,
        userId,
        name,
        initials: initials || "",
        type,
        category,
        title,
        content,
        code: code || "",
        tags: Array.isArray(tags)
          ? tags
          : [],
        likes: 0,
        comments: 0,
        active: true,
      });

    await CommunityUser.updateOne(
      { userId },
      {
        $set: {
          name,
          username:
            req.body.username || "",
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    await addCommunityXp(userId, POST_XP, {
      posts: 1,
    });

    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error(
      "Create community post error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create community post",
      error: error.message,
    });
  }
};

// =====================================================
// DELETE POST
// =====================================================

const deletePost = async (req, res) => {
  try {
    const {
      postId,
    } = req.params;

    const {
      userId,
    } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // The id may be the Mongo _id or the public postId; only query _id
    // when it is a valid ObjectId, otherwise Mongoose throws a CastError.
    const matches = [{ postId, userId }];

    if (mongoose.Types.ObjectId.isValid(postId)) {
      matches.push({ _id: postId, userId });
    }

    const post =
      await CommunityPost.findOneAndDelete({
        $or: matches,
      });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    await addCommunityXp(userId, -POST_XP, {
      posts: -1,
    });

    res.status(200).json({
      success: true,
      message:
        "Post deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete community post error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to delete community post",
      error: error.message,
    });
  }
};

// =====================================================
// GET QUESTIONS
// =====================================================

const getQuestions = async (
  req,
  res
) => {
  try {
    const questions =
      await CommunityQuestion.find({
        active: true,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      questions,
    });
  } catch (error) {
    console.error(
      "Get community questions error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch community questions",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE QUESTION
// =====================================================

const createQuestion = async (
  req,
  res
) => {
  try {
    const {
      userId,
      name,
      question,
    } = req.body;

    if (
      !userId ||
      !name ||
      !question
    ) {
      return res.status(400).json({
        success: false,
        message:
          "userId, name and question are required",
      });
    }

    const questionId =
      `question-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    const newQuestion =
      await CommunityQuestion.create({
        questionId,
        userId,
        name,
        question,
        answered: false,
        active: true,
      });

    await CommunityPost.create({
      postId:
        `post-${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,
      userId,
      name,
      initials:
        req.body.initials || "",
      type: "Question",
      category: "Help",
      title:
        req.body.title ||
        "Community Question",
      content: question,
      code:
        req.body.code || "",
      tags:
        Array.isArray(req.body.tags)
          ? req.body.tags
          : [],
      likes: 0,
      comments: 0,
      active: true,
    });

    res.status(201).json({
      success: true,
      question: newQuestion,
    });
  } catch (error) {
    console.error(
      "Create community question error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to create community question",
      error: error.message,
    });
  }
};

// =====================================================
// GET COMMUNITY SETTINGS
// =====================================================

const getSettings = async (
  req,
  res
) => {
  try {
    let settings =
      await CommunitySettings.findOne({
        settingId: "default",
        active: true,
      });

    if (!settings) {
      settings =
        await CommunitySettings.findOneAndUpdate(
          { settingId: "default" },
          { $setOnInsert: DEFAULT_SETTINGS },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true,
          }
        );
    }

    res.status(200).json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error(
      "Get community settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch community settings",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE / UPDATE COMMUNITY SETTINGS
// =====================================================

const upsertSettings = async (
  req,
  res
) => {
  try {
    const {
      filterCategories,
      postTypes,
      postCategories,
      helpGuidelines,
    } = req.body;

    const settings =
      await CommunitySettings.findOneAndUpdate(
        {
          settingId: "default",
        },
        {
          settingId: "default",
          filterCategories:
            Array.isArray(
              filterCategories
            )
              ? filterCategories
              : [],
          postTypes:
            Array.isArray(postTypes)
              ? postTypes
              : [],
          postCategories:
            Array.isArray(
              postCategories
            )
              ? postCategories
              : [],
          helpGuidelines:
            Array.isArray(
              helpGuidelines
            )
              ? helpGuidelines
              : [],
          active: true,
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
      settings,
    });
  } catch (error) {
    console.error(
      "Update community settings error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update community settings",
      error: error.message,
    });
  }
};

// =====================================================
// GET USER PROFILE + COMMUNITY STATS
// =====================================================

const getCommunityStats = async (
  req,
  res
) => {
  try {
    const {
      userId,
    } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    let user =
      await CommunityUser.findOne({
        userId,
      });

    if (!user) {
      const profile = await Profile.findOne({ userId })
        .select("name")
        .lean();

      user =
        await CommunityUser.create({
          userId,
          name:
            req.query.name ||
            profile?.name ||
            "Community Member",
        });
    }

    const level = levelFromXp(user.xp);

    const activeMembers =
      await CommunityUser.countDocuments({
        active: true,
      });

    const weekAgo =
      new Date(
        Date.now() -
          7 * 24 * 60 * 60 * 1000
      );

    const postsThisWeek =
      await CommunityPost.countDocuments({
        active: true,
        createdAt: {
          $gte: weekAgo,
        },
      });

    const questionsAnswered =
      await CommunityQuestion.countDocuments(
        {
          active: true,
          answered: true,
        }
      );

    const topContributors =
      await CommunityUser.find({
        active: true,
      })
        .sort({
          xp: -1,
        })
        .limit(5);

    const memberSince =
      user.memberSince;

    res.status(200).json({
      success: true,

      user: {
        id: user.userId,
        username:
          user.username,
        name: user.name,
        xp: level.xp,
        level: level.level,
        xpToNextLevel:
          level.xpToNextLevel,
        xpProgress:
          level.xpProgress,
        posts: Math.max(0, user.posts),
        streak: user.streak,
        lessons: user.lessons,
        badges: user.badges,
        memberSince,
      },

      community: {
        activeMembers,
        postsThisWeek,
        questionsAnswered,
        // No answer timestamps are tracked yet, so there is nothing to average.
        averageResponseTime: null,
      },

      topContributors:
        topContributors.map(
          (contributor) => ({
            id:
              contributor.userId,
            name:
              contributor.name,
            level:
              contributor.level,
            xp:
              contributor.xp,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Get community stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch community statistics",
      error: error.message,
    });
  }
};

// =====================================================
// UPDATE COMMUNITY USER
// Admin / integration use
// =====================================================

const updateCommunityUser =
  async (req, res) => {
    try {
      const {
        userId,
      } = req.params;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message:
            "userId is required",
        });
      }

      const allowedFields = [
        "username",
        "name",
        "xp",
        "level",
        "xpToNextLevel",
        "xpProgress",
        "streak",
        "lessons",
        "badges",
        "memberSince",
        "active",
      ];

      const updateData = {};

      allowedFields.forEach(
        (field) => {
          if (
            req.body[field] !==
            undefined
          ) {
            updateData[field] =
              req.body[field];
          }
        }
      );

      const user =
        await CommunityUser.findOneAndUpdate(
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
        user,
      });
    } catch (error) {
      console.error(
        "Update community user error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to update community user",
        error: error.message,
      });
    }
  };

// =====================================================
// GET LEADERBOARD
// =====================================================

const getLeaderboard = async (
  req,
  res
) => {
  try {
    const leaderboard =
      await CommunityUser.find({
        active: true,
      })
        .sort({
          xp: -1,
        })
        .limit(20);

    res.status(200).json({
      success: true,
      leaderboard:
        leaderboard.map(
          (user, index) => ({
            rank:
              index + 1,
            id: user.userId,
            name: user.name,
            username:
              user.username,
            level:
              user.level,
            xp: user.xp,
            badges:
              user.badges,
            posts:
              user.posts,
          })
        ),
    });
  } catch (error) {
    console.error(
      "Get leaderboard error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch leaderboard",
      error: error.message,
    });
  }
};

// =====================================================
// GET ACTIVE CHALLENGES
// =====================================================

const getChallenges = async (
  req,
  res
) => {
  try {
    const now = Date.now();

    const stored =
      await CommunityChallenge.find({
        active: true,
      }).sort({
        createdAt: 1,
      });

    const challenges = stored
      .filter(
        (item) =>
          !item.endsAt ||
          item.endsAt.getTime() > now
      )
      .map((item) => {
        const challenge = item.toObject();

        if (item.endsAt) {
          challenge.daysLeft = Math.max(
            0,
            Math.ceil(
              (item.endsAt.getTime() - now) /
                (24 * 60 * 60 * 1000)
            )
          );
        }

        return challenge;
      });

    res.status(200).json({
      success: true,
      challenges,
    });
  } catch (error) {
    console.error(
      "Get community challenges error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch community challenges",
      error: error.message,
    });
  }
};

// =====================================================
// CREATE CHALLENGE
// =====================================================

const createChallenge =
  async (req, res) => {
    try {
      const {
        challengeId,
        title,
        description,
        colorType,
        daysLeft,
        endsAt,
      } = req.body;

      if (
        !challengeId ||
        !title ||
        !description ||
        (daysLeft === undefined && !endsAt)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "challengeId, title, description and daysLeft (or endsAt) are required",
        });
      }

      const endDate = endsAt
        ? new Date(endsAt)
        : new Date(
            Date.now() +
              Number(daysLeft) *
                24 * 60 * 60 * 1000
          );

      if (Number.isNaN(endDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "endsAt is not a valid date",
        });
      }

      const existing =
        await CommunityChallenge.findOne(
          {
            challengeId,
          }
        );

      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "Challenge already exists",
        });
      }

      const challenge =
        await CommunityChallenge.create(
          {
            challengeId,
            title,
            description,
            colorType:
              colorType || "purple",
            daysLeft: Math.max(
              0,
              Math.ceil(
                (endDate.getTime() - Date.now()) /
                  (24 * 60 * 60 * 1000)
              )
            ),
            endsAt: endDate,
            active: true,
          }
        );

      res.status(201).json({
        success: true,
        challenge,
      });
    } catch (error) {
      console.error(
        "Create community challenge error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Failed to create community challenge",
        error: error.message,
      });
    }
  };

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  getPosts,
  createPost,
  deletePost,
  getQuestions,
  createQuestion,
  getSettings,
  upsertSettings,
  getCommunityStats,
  updateCommunityUser,
  getLeaderboard,
  getChallenges,
  createChallenge,
};