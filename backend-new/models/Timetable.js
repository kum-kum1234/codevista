const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const entrySchema = new mongoose.Schema(
  {
    slotId: {
      type: String,
      required: true,
    },
    dayKey: {
      type: String,
      required: true,
      enum: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      default: "",
      trim: true,
    },
    colorIndex: {
      type: Number,
      default: 4,
    },
  },
  { _id: false }
);

const timetableSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    showWeekend: {
      type: Boolean,
      default: true,
    },

    slots: {
      type: [slotSchema],
      default: [],
    },

    entries: {
      type: [entrySchema],
      default: [],
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "timetables",
  }
);

module.exports =
  mongoose.models.Timetable ||
  mongoose.model("Timetable", timetableSchema);