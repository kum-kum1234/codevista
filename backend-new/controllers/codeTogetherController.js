const CodeTogetherContent = require("../models/CodeTogetherContent");
const CodeTogetherRegistration = require("../models/CodeTogetherRegistration");

const DEFAULT_CONTENT = {
  key: "default",

  banner: {
    label: "COMMUNITY",
    title: "Welcome to Code Together!",
    description:
      "Join our weekly Zoom meetups where CodeVista learners come together to code, create, and help each other.",
  },

  schedule: {
    day: "Saturday",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    timezone: "Indian Standard Time",
    where: "On Zoom (link below)",
    whoCanJoin: "All CodeVista learners (ages 8–14)",
  },

  joinSteps: [
    "Click the Zoom link when it's time.",
    "Mute your mic unless you're talking.",
    "Be kind, be curious, and have fun.",
    "You can bring your code or just watch!",
  ],

  zoom: {
    title: "Join the Zoom Session",
    joinText: "Click here to join Code Together",
    joinUrl: "",
    registeredHelpText:
      "(Need help? Ask a parent to join you for the first time!)",
    unregisteredHelpText:
      "(Register above to unlock this link — need help? Ask a parent to join you for the first time!)",
  },

  whatWeDo: [
    {
      icon: "🐍",
      text: "Show your Python projects",
    },
    {
      icon: "🙋",
      text: "Ask for help with tricky code",
    },
    {
      icon: "💡",
      text: "Learn something new from other kids",
    },
    {
      icon: "🎉",
      text: "Have fun with friends who code!",
    },
  ],

  parents: {
    title: "For Parents",
    description:
      "All sessions are monitored by the CodeVista team. There are no public recordings, and video is optional for kids. Safe, simple, and fun — just the way learning should be.",
  },

  experienceLevels: [
    "Just starting out",
    "Some experience",
    "Confident coder",
  ],

  active: true,
};

async function getOrCreateContent() {
  let content = await CodeTogetherContent.findOne({
    key: "default",
    active: true,
  });

  if (!content) {
    content = await CodeTogetherContent.create(DEFAULT_CONTENT);
  }

  return content;
}

function formatContent(content) {
  return {
    id: content._id,
    key: content.key,
    banner: content.banner,
    schedule: content.schedule,
    joinSteps: content.joinSteps || [],
    zoom: content.zoom,
    whatWeDo: content.whatWeDo || [],
    parents: content.parents,
    experienceLevels: content.experienceLevels || [],
    active: content.active,
    createdAt: content.createdAt,
    updatedAt: content.updatedAt,
  };
}

// GET /api/code-together?userId=...
const getCodeTogether = async (req, res) => {
  try {
    const userId = (req.query.userId || "").trim();

    const content = await getOrCreateContent();

    let registrations = [];

    if (userId) {
      registrations = await CodeTogetherRegistration.find({
        userId,
        active: true,
      })
        .sort({ dateKey: 1 })
        .lean();
    }

    res.status(200).json({
      success: true,

      content: formatContent(content),

      registrations: registrations.map((item) => ({
        id: item._id,
        dateKey: item.dateKey,
        studentName: item.studentName,
        age: item.age,
        grade: item.grade,
        parentContact: item.parentContact,
        experience: item.experience,
      })),
    });
  } catch (error) {
    console.error("Get Code Together error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch Code Together content",
      error: error.message,
    });
  }
};

// PUT /api/code-together/content
const upsertCodeTogetherContent = async (req, res) => {
  try {
    const body = req.body?.content || req.body;

    const content = await CodeTogetherContent.findOneAndUpdate(
      {
        key: "default",
      },
      {
        ...body,
        key: "default",
        active: body.active !== false,
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
      content: formatContent(content),
    });
  } catch (error) {
    console.error(
      "Update Code Together content error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to save Code Together content",
      error: error.message,
    });
  }
};

// POST /api/code-together/registrations
const registerForCodeTogether = async (req, res) => {
  try {
    const {
      userId,
      dateKey,
      studentName,
      age,
      grade,
      parentContact,
      experience,
    } = req.body;

    if (
      !userId ||
      !dateKey ||
      !studentName?.trim() ||
      age === undefined ||
      !grade?.trim() ||
      !parentContact?.trim() ||
      !experience
    ) {
      return res.status(400).json({
        success: false,
        message: "All registration fields are required",
      });
    }

    const ageNumber = Number(age);

    if (
      !Number.isInteger(ageNumber) ||
      ageNumber < 5 ||
      ageNumber > 18
    ) {
      return res.status(400).json({
        success: false,
        message: "Age should be between 5 and 18",
      });
    }

    const existing =
      await CodeTogetherRegistration.findOne({
        userId,
        dateKey,
        active: true,
      });

    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          "You are already registered for this session",
      });
    }

    const registration =
      await CodeTogetherRegistration.create({
        userId,
        dateKey,
        studentName: studentName.trim(),
        age: ageNumber,
        grade: grade.trim(),
        parentContact: parentContact.trim(),
        experience: experience.trim(),
        active: true,
      });

    res.status(201).json({
      success: true,

      registration: {
        id: registration._id,
        dateKey: registration.dateKey,
        studentName: registration.studentName,
        age: registration.age,
        grade: registration.grade,
        parentContact: registration.parentContact,
        experience: registration.experience,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "You are already registered for this session",
      });
    }

    console.error(
      "Register Code Together error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to register for Code Together",
      error: error.message,
    });
  }
};

// DELETE /api/code-together/registrations/:dateKey?userId=...
const cancelCodeTogetherRegistration = async (
  req,
  res
) => {
  try {
    const userId = (req.query.userId || "").trim();
    const { dateKey } = req.params;

    if (!userId || !dateKey) {
      return res.status(400).json({
        success: false,
        message: "userId and dateKey are required",
      });
    }

    const deleted =
      await CodeTogetherRegistration.findOneAndDelete({
        userId,
        dateKey,
      });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Registration cancelled successfully",
      dateKey,
    });
  } catch (error) {
    console.error(
      "Cancel Code Together error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to cancel registration",
      error: error.message,
    });
  }
};

module.exports = {
  getCodeTogether,
  upsertCodeTogetherContent,
  registerForCodeTogether,
  cancelCodeTogetherRegistration,
};