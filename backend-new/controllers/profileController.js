const Profile = require("../models/Profile");

const DEFAULT_SUBSCRIPTION = {
  plan: "Free",
  description:
    "Upgrade to Premium for full access to all courses and features",
  benefits: [
    "Access to all courses and updates",
    "Project files and source code downloads",
    "Live coding sessions with instructors",
    "Certificates upon course completion",
  ],
  price: 4999,
  period: "per annum",
  status: "active",
};

function formatProfile(profile) {
  if (!profile) return null;

  return {
    id: profile._id.toString(),
    userId: profile.userId,

    name: profile.name || "",
    email: profile.email || "",
    phone: profile.phone || "",

    provider: profile.provider || "email",
    accountType: profile.accountType || "Free",

    overallProgress: profile.overallProgress ?? 0,
    achievementsCount: profile.achievementsCount ?? 0,
    streak: profile.streak ?? 0,

    notifications: {
      courseUpdates:
        profile.notifications?.courseUpdates ?? true,

      achievements:
        profile.notifications?.achievements ?? true,

      weeklyReport:
        profile.notifications?.weeklyReport ?? true,
    },

    subscription: {
      plan: profile.subscription?.plan || "Free",

      description:
        profile.subscription?.description || "",

      benefits: Array.isArray(profile.subscription?.benefits)
        ? profile.subscription.benefits
        : [],

      price: profile.subscription?.price ?? 0,

      period:
        profile.subscription?.period || "per annum",

      status:
        profile.subscription?.status || "active",
    },

    active: profile.active !== false,

    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
}

async function getOrCreateProfile(userId) {
  let profile = await Profile.findOne({ userId });

  if (!profile) {
    profile = await Profile.create({
      userId,
      subscription: DEFAULT_SUBSCRIPTION,
    });
  }

  return profile;
}


// =====================================================
// GET PROFILE
// =====================================================

exports.getProfile = async (req, res) => {
  try {
    const userId = String(req.params.userId || "").trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const profile = await getOrCreateProfile(userId);

    return res.json({
      success: true,
      profile: formatProfile(profile),
    });
  } catch (error) {
    console.error("Get profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


// =====================================================
// UPDATE PROFILE
// =====================================================

exports.updateProfile = async (req, res) => {
  try {
    const userId = String(req.params.userId || "").trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    // email / accountType / provider are server-controlled (email must not be user-editable) (payment webhook, login)
    const allowedFields = [
      "name",
      "phone",
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    // =====================================================
    // CHECK PHONE NUMBER ALREADY REGISTERED
    // =====================================================

    if (req.body.phone !== undefined) {
      const phone = String(req.body.phone).trim();

      if (phone && !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid 10-digit mobile number.",
        });
      }

      if (phone) {
        const existingProfile = await Profile.findOne({
          phone,
          userId: { $ne: userId },
          active: true,
        });

        if (existingProfile) {
          return res.status(409).json({
            success: false,
            code: "PHONE_ALREADY_REGISTERED",
            message:
              "Account already registered using this number.",
          });
        }

        updateData.phone = phone;
      }
    }

    // =====================================================
    // UPDATE PROFILE
    // =====================================================

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    return res.json({
      success: true,
      message: "Profile updated successfully",
      profile: formatProfile(profile),
    });
  } catch (error) {
    // Two simultaneous updates hit the unique phone index.
    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        code: "PHONE_ALREADY_REGISTERED",
        message: "Account already registered using this number.",
      });
    }

    console.error("Update profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};


// =====================================================
// UPDATE NOTIFICATIONS
// =====================================================

exports.updateNotifications = async (req, res) => {
  try {
    const userId = String(req.params.userId || "").trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const allowed = [
      "courseUpdates",
      "achievements",
      "weeklyReport",
    ];

    const notificationUpdate = {};

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        notificationUpdate[`notifications.${field}`] =
          Boolean(req.body[field]);
      }
    });

    const profile = await Profile.findOneAndUpdate(
      { userId },
      { $set: notificationUpdate },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return res.json({
      success: true,
      message:
        "Notification settings updated successfully",
      profile: formatProfile(profile),
    });
  } catch (error) {
    console.error(
      "Update notifications error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to update notification settings",
      error: error.message,
    });
  }
};


// =====================================================
// DELETE PROFILE
// =====================================================

exports.deleteProfile = async (req, res) => {
  try {
    const userId = String(req.params.userId || "").trim();

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    await Profile.deleteOne({ userId });

    return res.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete profile",
      error: error.message,
    });
  }
};