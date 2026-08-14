const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true
    },

    password: {
      type: String,
      select: false,
    },
    authProvider: {
      type: String,
      enum: ["email", "phone", "google"],
      required: true,
    },
    phone: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);

userSchema.set("toJSON", {
  transform: (doc, user) => {
    delete user.password;
    return user;
  },
});
