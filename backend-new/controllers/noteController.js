const Note = require("../models/Note");

function formatNote(note) {
  if (!note) return null;

  const data = note.toObject ? note.toObject() : note;

  return {
    id: String(data._id || data.id),

    userId: data.userId,

    title: data.title || "",

    body: data.body || "",

    colorIndex: Number.isInteger(data.colorIndex)
      ? data.colorIndex
      : 0,

    subjectId: data.subjectId || null,

    pinned: Boolean(data.pinned),

    active: data.active !== false,

    createdAt: data.createdAt
      ? new Date(data.createdAt).getTime()
      : Date.now(),

    updatedAt: data.updatedAt
      ? new Date(data.updatedAt).getTime()
      : Date.now(),
  };
}


// GET /api/notes/:userId
const getNotes = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const notes = await Note.find({
      userId,
      active: true,
    }).sort({
      pinned: -1,
      updatedAt: -1,
    });

    res.status(200).json({
      success: true,
      notes: notes.map(formatNote),
    });
  } catch (error) {
    console.error("Get notes error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};


// POST /api/notes
const createNote = async (req, res) => {
  try {
    const {
      userId,
      title,
      body,
      colorIndex,
      subjectId,
      pinned,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const note = await Note.create({
      userId,

      title: title || "",

      body: body || "",

      colorIndex: Number.isInteger(colorIndex)
        ? colorIndex
        : 0,

      subjectId: subjectId || null,

      pinned: Boolean(pinned),

      active: true,
    });

    res.status(201).json({
      success: true,
      note: formatNote(note),
    });
  } catch (error) {
    console.error("Create note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};


// PUT /api/notes/:noteId
const updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;

    const {
      userId,
      title,
      body,
      colorIndex,
      subjectId,
      pinned,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const update = {};

    if (title !== undefined) {
      update.title = title;
    }

    if (body !== undefined) {
      update.body = body;
    }

    if (colorIndex !== undefined) {
      update.colorIndex = colorIndex;
    }

    if (subjectId !== undefined) {
      update.subjectId = subjectId || null;
    }

    if (pinned !== undefined) {
      update.pinned = Boolean(pinned);
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId,
        active: true,
      },
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      note: formatNote(note),
    });
  } catch (error) {
    console.error("Update note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update note",
    });
  }
};


// DELETE /api/notes/:noteId?userId=...
const deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const note = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId,
        active: true,
      },
      {
        active: false,
      },
      {
        new: true,
      }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete note error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};


// PATCH /api/notes/:noteId/pin
const togglePin = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const note = await Note.findOne({
      _id: noteId,
      userId,
      active: true,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    note.pinned = !note.pinned;

    await note.save();

    res.status(200).json({
      success: true,
      note: formatNote(note),
    });
  } catch (error) {
    console.error("Toggle note pin error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to toggle note pin",
    });
  }
};


module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePin,
};