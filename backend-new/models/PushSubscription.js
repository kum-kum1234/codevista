const mongoose = require("mongoose");

const pushSubscriptionSchema =
  new mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
        index: true,
        trim: true,
      },

      endpoint: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true,
      },

      expirationTime: {
        type: Number,
        default: null,
      },

      keys: {
        p256dh: {
          type: String,
          required: true,
        },

        auth: {
          type: String,
          required: true,
        },
      },

      active: {
        type: Boolean,
        default: true,
        index: true,
      },
    },
    {
      timestamps: true,
      collection: "pushsubscriptions",
    }
  );

module.exports =
  mongoose.models.PushSubscription ||
  mongoose.model(
    "PushSubscription",
    pushSubscriptionSchema
  );