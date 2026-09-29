const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const Profile = require("../models/Profile");

const router = express.Router();

const otpStore = new Map(); // phone -> { code, expiresAt }


// =====================================================
// HELPERS
// =====================================================

function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateUserId() {
  return crypto.randomUUID();
}


// =====================================================
// EMAIL LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: "Email is required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({
        error: "Enter a valid email address.",
      });
    }

    // =================================================
    // CHECK WHETHER USER ALREADY EXISTS
    // =================================================

    let profile = await Profile.findOne({
      email: normalizedEmail,
    });

    // =================================================
    // CREATE NEW USER IF NOT FOUND
    // =================================================

    if (!profile) {
      profile = await Profile.create({
        userId: generateUserId(),

        name: normalizedEmail
          .split("@")[0]
          .split(/[._-]+/)
          .filter(Boolean)
          .map(
            (word) =>
              word.charAt(0).toUpperCase() + word.slice(1)
          )
          .join(" "),

        email: normalizedEmail,

        provider: "email",

        accountType: "Free",

        active: true,
      });

      console.log(
        `✅ New user created: ${normalizedEmail}`
      );
    } else {
      console.log(
        `✅ Existing user logged in: ${normalizedEmail}`
      );
    }

    // =================================================
    // RETURN USER TO FRONTEND
    // =================================================

    return res.status(200).json({
      status: "success",
      message: "Login successful.",

      user: {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        provider: profile.provider,
        accountType: profile.accountType,
        premiumCourses: profile.premiumCourses,
      },
    });

  } catch (error) {
    console.error("========== EMAIL LOGIN ERROR ==========");
    console.error(error);
    console.error("=======================================");

    return res.status(500).json({
      error: "Login failed. Please try again.",
    });
  }
});


// =====================================================
// SEND OTP
// =====================================================

router.post("/otp/send", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      error: "Phone number is required.",
    });
  }

  if (!isValidIndianPhone(phone)) {
    return res.status(400).json({
      error: "Enter a valid 10-digit mobile number.",
    });
  }

  const code = generateOtp();

  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(phone, {
    code,
    expiresAt,
  });

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/transactionalSMS/send",
      {
        sender: process.env.BREVO_SENDER_NAME,

        recipient: `91${phone}`,

        content: `Your CodeVista OTP is ${code}. Valid for 5 minutes.`,

        type: "transactional",
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          accept: "application/json",
          "content-type": "application/json",
        },
      }
    );

    console.log("Brevo response:", response.data);

    return res.status(200).json({
      status: "sent",
      message: "OTP generated successfully",
      otp: code,
    });

  } catch (err) {
    console.error("========== BREVO ERROR ==========");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    console.error("=================================");

    return res.status(500).json({
      error: "Could not send OTP. Please try again.",
    });
  }
});


// =====================================================
// VERIFY OTP
// =====================================================

router.post("/otp/verify", async (req, res) => {
  try {
    const {
      phone,
      code,
      name,
      email,
    } = req.body;

    if (!phone || !code) {
      return res.status(400).json({
        error: "Phone and code are required.",
      });
    }

    if (!isValidIndianPhone(phone)) {
      return res.status(400).json({
        error: "Enter a valid 10-digit mobile number.",
      });
    }

    const record = otpStore.get(phone);

    if (!record) {
      return res.status(400).json({
        error: "No OTP requested for this number.",
      });
    }

    // =================================================
    // CHECK OTP EXPIRATION
    // =================================================

    if (Date.now() > record.expiresAt) {
      otpStore.delete(phone);

      return res.status(400).json({
        error: "Code expired. Please request a new one.",
      });
    }

    // =================================================
    // CHECK OTP
    // =================================================

    if (record.code !== code) {
      return res.status(400).json({
        error: "Incorrect code.",
      });
    }

    // OTP is valid
    otpStore.delete(phone);

    // =================================================
    // FIND EXISTING PHONE USER
    // =================================================

    let profile = await Profile.findOne({
      phone,
    });

    // =================================================
    // CREATE USER IF NOT FOUND
    // =================================================

    if (!profile) {
      profile = await Profile.create({
        userId: generateUserId(),

        name: name?.trim() || "Guest",

        email: email?.trim().toLowerCase() || "",

        phone,

        provider: "phone",

        accountType: "Free",

        active: true,
      });

      console.log(
        `✅ New phone user created: ${phone}`
      );

    } else {

      // =================================================
      // UPDATE OPTIONAL INFORMATION
      // =================================================

      let changed = false;

      if (
        name?.trim() &&
        profile.name === "Guest"
      ) {
        profile.name = name.trim();
        changed = true;
      }

      if (
        email?.trim() &&
        !profile.email
      ) {
        profile.email = email.trim().toLowerCase();
        changed = true;
      }

      if (changed) {
        await profile.save();
      }

      console.log(
        `✅ Existing phone user logged in: ${phone}`
      );
    }

    // =================================================
    // RETURN USER
    // =================================================

    return res.status(200).json({
      status: "approved",
      message: "OTP verified successfully.",

      user: {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        provider: profile.provider,
        accountType: profile.accountType,
        premiumCourses: profile.premiumCourses,
      },
    });

  } catch (error) {
    console.error("========== OTP VERIFY ERROR ==========");
    console.error(error);
    console.error("======================================");

    return res.status(500).json({
      error: "OTP verification failed. Please try again.",
    });
  }
});


// =====================================================
// LOGOUT
// =====================================================

router.post("/logout", async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("=================================");
    console.log("Logout request received");
    console.log("User ID:", userId || "Not provided");
    console.log("=================================");

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });

  } catch (error) {
    console.error("========== LOGOUT ERROR ==========");
    console.error(error);
    console.error("=================================");

    return res.status(500).json({
      success: false,
      error: "Logout failed. Please try again.",
    });
  }
});


module.exports = router;