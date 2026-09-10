const NoteSubject = require("../models/NoteSubject");

const DEFAULT_SUBJECTS = [
  {
    id: "python-programming",
    name: "Python Programming",
    icon: "Laptop",
    order: 0,
  },
  {
    id: "mathematics",
    name: "Mathematics",
    icon: "Calculator",
    order: 1,
  },
  {
    id: "science",
    name: "Science",
    icon: "Atom",
    order: 2,
  },
  {
    id: "reading",
    name: "Reading",
    icon: "BookOpen",
    order: 3,
  },
  {
    id: "art-design",
    name: "Art & Design",
    icon: "Palette",
    order: 4,
  },
  {
    id: "music",
    name: "Music",
    icon: "Music2",
    order: 5,
  },
  {
    id: "social-studies",
    name: "Social Studies",
    icon: "Globe2",
    order: 6,
  },
  {
    id: "physical-education",
    name: "Physical Education",
    icon: "Users2",
    order: 7,
  },
];

function formatSubjects(record) {
  if (!record) {
    return [];
  }

  const subjects = Array.isArray(record.subjects)
    ? record.subjects
    : [];

  return [...subjects]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((subject) => ({
      id: subject.id,
      name: subject.name,
      icon: subject.icon || "BookOpen",
    }));
}

async function getOrCreateSubjects(userId) {
  let record = await NoteSubject.findOne({
    userId,
    active: true,
  });

  if (!record) {
    record = await NoteSubject.create({
      userId,
      subjects: DEFAULT_SUBJECTS,
      active: true,
    });

    return record;
  }

  // If an existing document has no valid subjects array,
  // restore the default subjects.
  if (!Array.isArray(record.subjects)) {
    record.subjects = DEFAULT_SUBJECTS;
    await record.save();
  }

  return record;
}

// GET /api/note-subjects/:userId
const getSubjects = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const record = await getOrCreateSubjects(userId);

    res.status(200).json({
      success: true,
      subjects: formatSubjects(record),
    });
  } catch (error) {
    console.error("Get subjects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch note subjects",
      error: error.message,
    });
  }
};

// POST /api/note-subjects
const addSubject = async (req, res) => {
  try {
    const { userId, name, icon } = req.body;

    if (!userId || !name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "userId and name are required",
      });
    }

    const record = await getOrCreateSubjects(userId);

    const cleanName = name.trim();

    const duplicate = record.subjects.some(
      (subject) =>
        subject.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: "Subject already exists",
      });
    }

    const id = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;

    record.subjects.push({
      id,
      name: cleanName,
      icon: icon || "BookOpen",
      order: record.subjects.length,
    });

    await record.save();

    res.status(201).json({
      success: true,
      subjects: formatSubjects(record),
    });
  } catch (error) {
    console.error("Add subject error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add note subject",
      error: error.message,
    });
  }
};

// PUT /api/note-subjects/:userId/reorder
const reorderSubjects = async (req, res) => {
  try {
    const { userId } = req.params;
    const { subjects } = req.body;

    if (!userId || !Array.isArray(subjects)) {
      return res.status(400).json({
        success: false,
        message: "userId and subjects are required",
      });
    }

    const record = await getOrCreateSubjects(userId);

    const existingById = new Map(
      record.subjects.map((subject) => [subject.id, subject])
    );

    const reordered = [];

    subjects.forEach((subject, index) => {
      const existing = existingById.get(subject.id);

      if (existing) {
        existing.order = index;
        reordered.push(existing);
      }
    });

    record.subjects.forEach((existing) => {
      const alreadyIncluded = reordered.some(
        (subject) => subject.id === existing.id
      );

      if (!alreadyIncluded) {
        existing.order = reordered.length;
        reordered.push(existing);
      }
    });

    record.subjects = reordered;

    await record.save();

    res.status(200).json({
      success: true,
      subjects: formatSubjects(record),
    });
  } catch (error) {
    console.error("Reorder subjects error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to reorder note subjects",
      error: error.message,
    });
  }
};

module.exports = {
  getSubjects,
  addSubject,
  reorderSubjects,
};