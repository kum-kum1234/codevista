const Timetable = require("../models/Timetable");

const DEFAULT_SLOTS = [
  { id: "s1", start: "08:00", end: "09:00" },
  { id: "s2", start: "09:00", end: "10:00" },
  { id: "s3", start: "10:00", end: "11:00" },
  { id: "s4", start: "11:00", end: "12:00" },
  { id: "s5", start: "14:00", end: "15:00" },
  { id: "s6", start: "15:00", end: "16:00" },
];
function normalizeEntries(entries) {
  if (!Array.isArray(entries)) {
    return [];
  }

  return entries
    .filter(
      (entry) =>
        entry &&
        entry.slotId &&
        entry.dayKey &&
        typeof entry.subject === "string"
    )
    .map((entry) => ({
      slotId: String(entry.slotId),
      dayKey: String(entry.dayKey),
      subject: String(entry.subject).trim(),
      note: typeof entry.note === "string" ? entry.note.trim() : "",
      colorIndex: Number.isInteger(entry.colorIndex)
        ? entry.colorIndex
        : 4,
    }))
    .filter((entry) => entry.subject);
}

function normalizeSlots(slots) {
  if (!Array.isArray(slots)) {
    return DEFAULT_SLOTS;
  }

  return slots
    .filter(
      (slot) =>
        slot &&
        slot.id &&
        typeof slot.start === "string" &&
        typeof slot.end === "string"
    )
    .map((slot) => ({
      id: String(slot.id),
      start: String(slot.start),
      end: String(slot.end),
    }));
}

// GET /api/timetable/:userId
const getTimetable = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    let timetable = await Timetable.findOne({
      userId,
      active: true,
    }).lean();

    // Create the user's timetable the first time they open the page.
    if (!timetable) {
      const created = await Timetable.create({
        userId,
        showWeekend: true,
        slots: DEFAULT_SLOTS,
        entries: [],
        active: true,
      });

      timetable = created.toObject();
    }

    return res.status(200).json({
      success: true,
      timetable,
    });
  } catch (error) {
    console.error("Get timetable error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load timetable",
      error: error.message,
    });
  }
};

// PUT /api/timetable/:userId
const saveTimetable = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const body = req.body || {};

    const slots = normalizeSlots(body.slots);
    const entries = normalizeEntries(body.entries);

    const showWeekend =
      typeof body.showWeekend === "boolean"
        ? body.showWeekend
        : true;

    const timetable = await Timetable.findOneAndUpdate(
      { userId },
      {
        $set: {
          showWeekend,
          slots,
          entries,
          active: true,
        },
        $setOnInsert: {
          userId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return res.status(200).json({
      success: true,
      message: "Timetable saved successfully",
      timetable,
    });
  } catch (error) {
    console.error("Save timetable error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save timetable",
      error: error.message,
    });
  }
};

// DELETE /api/timetable/:userId
const clearTimetable = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const timetable = await Timetable.findOneAndUpdate(
      { userId },
      {
        $set: {
          showWeekend: true,
          slots: DEFAULT_SLOTS,
          entries: [],
          active: true,
        },
        $setOnInsert: {
          userId,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    ).lean();

    return res.status(200).json({
      success: true,
      message: "Timetable reset successfully",
      timetable,
    });
  } catch (error) {
    console.error("Clear timetable error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reset timetable",
      error: error.message,
    });
  }
};

module.exports = {
  getTimetable,
  saveTimetable,
  clearTimetable,
};