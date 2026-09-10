const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    q: {
      type: String,
      required: true,
      trim: true,
    },
    a: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true }
);

const featureSchema = new mongoose.Schema(
  {
    icon: {
      type: String,
      default: "BookOpen",
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
    colorIndex: {
      type: Number,
      default: 0,
    },
  },
  { _id: true }
);

const guideStepSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: true }
);

const contactSchema = new mongoose.Schema(
  {
    emailTitle: {
      type: String,
      default: "Email Us",
      trim: true,
    },

    emailDescription: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
    },

    communityTitle: {
      type: String,
      default: "Ask the Community",
      trim: true,
    },

    communityDescription: {
      type: String,
      default: "",
      trim: true,
    },

    communityPath: {
      type: String,
      default: "/community",
      trim: true,
    },

    communityLinkText: {
      type: String,
      default: "Visit Community ↗",
      trim: true,
    },

    furtherTitle: {
      type: String,
      default: "Want to Go Further?",
      trim: true,
    },

    externalTitle: {
      type: String,
      default: "",
      trim: true,
    },

    externalDescription: {
      type: String,
      default: "",
      trim: true,
    },

    externalUrl: {
      type: String,
      default: "",
      trim: true,
    },

    externalLinkText: {
      type: String,
      default: "Visit ↗",
      trim: true,
    },
  },
  { _id: false }
);

const helpSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "default",
      trim: true,
    },

    faqs: {
      type: [faqSchema],
      default: [],
    },

    features: {
      type: [featureSchema],
      default: [],
    },

    guideSteps: {
      type: [guideStepSchema],
      default: [],
    },

    contact: {
      type: contactSchema,
      default: () => ({}),
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "helpcontents",
  }
);

module.exports =
  mongoose.models.Help || mongoose.model("Help", helpSchema);