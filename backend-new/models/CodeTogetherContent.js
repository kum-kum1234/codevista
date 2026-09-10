const mongoose = require("mongoose");

const codeTogetherContentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "default",
      index: true,
    },

    banner: {
      label: {
        type: String,
        default: "COMMUNITY",
      },

      title: {
        type: String,
        required: true,
      },

      description: {
        type: String,
        required: true,
      },
    },

    schedule: {
      day: {
        type: String,
        required: true,
      },

      startTime: {
        type: String,
        required: true,
      },

      endTime: {
        type: String,
        required: true,
      },

      timezone: {
        type: String,
        required: true,
      },

      where: {
        type: String,
        required: true,
      },

      whoCanJoin: {
        type: String,
        required: true,
      },
    },

    joinSteps: [
      {
        type: String,
        trim: true,
      },
    ],

    zoom: {
      title: {
        type: String,
        required: true,
      },

      joinText: {
        type: String,
        required: true,
      },

      joinUrl: {
        type: String,
        default: "",
      },

      registeredHelpText: {
        type: String,
        required: true,
      },

      unregisteredHelpText: {
        type: String,
        required: true,
      },
    },

    whatWeDo: [
      {
        icon: {
          type: String,
          default: "",
        },

        text: {
          type: String,
          default: "",
        },
      },
    ],

    parents: {
      title: {
        type: String,
        default: "For Parents",
      },

      description: {
        type: String,
        required: true,
      },
    },

    experienceLevels: [
      {
        type: String,
        trim: true,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "codetogethercontents",
  }
);

module.exports = mongoose.model(
  "CodeTogetherContent",
  codeTogetherContentSchema
);