const express = require("express");
//const axios = require("axios");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Profile = require("../models/Profile");

const router = express.Router();

// =====================================================
// OTP STORAGE
// =====================================================

// phone -> { code, expiresAt }
const otpStore = new Map();

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

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =====================================================
// REGISTER WITH EMAIL + PASSWORD
// =====================================================
// Creates a new email account.
//
// Password is NEVER stored directly.
// Only bcrypt hash is stored.
// =====================================================

router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // -------------------------------------------------
    // VALIDATE INPUT
    // -------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // -------------------------------------------------
    // VALIDATE EMAIL
    // -------------------------------------------------

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        error: "Enter a valid email address.",
      });
    }

    // -------------------------------------------------
    // VALIDATE PASSWORD
    // -------------------------------------------------

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters.",
      });
    }

    // -------------------------------------------------
    // CHECK EXISTING USER
    // -------------------------------------------------

    const existingUser = await Profile.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists.",
      });
    }

    // -------------------------------------------------
    // GENERATE NAME
    // -------------------------------------------------

    const generatedName =
      normalizedEmail
        .split("@")[0]
        .split(/[._-]+/)
        .filter(Boolean)
        .map(
          (word) =>
            word.charAt(0).toUpperCase() +
            word.slice(1)
        )
        .join(" ") || "User";

    const finalName =
      name?.trim() || generatedName;

    // -------------------------------------------------
    // HASH PASSWORD
    // -------------------------------------------------

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

    // -------------------------------------------------
    // CREATE USER
    // -------------------------------------------------

    const profile = await Profile.create({
      userId: generateUserId(),

      name: finalName,

      email: normalizedEmail,

      phone: "",

      provider: "email",

      passwordHash,

      accountType: "Free",

      premiumCourses: [],

      active: true,
    });

    console.log(
      `✅ New account created: ${normalizedEmail}`
    );

    // -------------------------------------------------
    // RETURN SAFE USER DATA
    // -------------------------------------------------

    return res.status(201).json({
      status: "success",

      message: "Account created successfully.",

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
    console.error(
      "========== REGISTER ERROR =========="
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return res.status(500).json({
      error:
        "Registration failed. Please try again.",
    });
  }
});

// =====================================================
// EMAIL LOGIN
// =====================================================
// Login ONLY works for an existing account.
//
// Flow:
// 1. Validate email/password
// 2. Find existing user
// 3. Check account status
// 4. Check passwordHash
// 5. Compare password using bcrypt
// 6. Return safe user information
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // -------------------------------------------------
    // VALIDATE INPUT
    // -------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required.",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    // -------------------------------------------------
    // VALIDATE EMAIL
    // -------------------------------------------------

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        error: "Enter a valid email address.",
      });
    }

    // -------------------------------------------------
    // FIND USER
    // -------------------------------------------------

     const profile = await Profile.findOne({
  email: normalizedEmail,
}).select("+passwordHash");

    // -------------------------------------------------
    // USER NOT FOUND
    // -------------------------------------------------

    if (!profile) {
      console.log(
        `❌ Login failed. User not found: ${normalizedEmail}`
      );

      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // -------------------------------------------------
    // CHECK ACCOUNT STATUS
    // -------------------------------------------------

    if (profile.active === false) {
      return res.status(403).json({
        error: "This account has been disabled.",
      });
    }

    // -------------------------------------------------
    // CHECK PASSWORD HASH
    // -------------------------------------------------

    if (!profile.passwordHash) {
      console.log(
        `❌ No password hash found for: ${normalizedEmail}`
      );

      return res.status(401).json({
        error:
          "This account does not have a password. Please use phone login or register again.",
      });
    }

    // -------------------------------------------------
    // COMPARE PASSWORD
    // -------------------------------------------------

    const passwordMatch =
      await bcrypt.compare(
        password,
        profile.passwordHash
      );

    // -------------------------------------------------
    // WRONG PASSWORD
    // -------------------------------------------------

    if (!passwordMatch) {
      console.log(
        `❌ Incorrect password for: ${normalizedEmail}`
      );

      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // -------------------------------------------------
    // LOGIN SUCCESSFUL
    // -------------------------------------------------

    console.log(
      `✅ User logged in successfully: ${normalizedEmail}`
    );

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
        premiumCourses:
          profile.premiumCourses || [],
      },
    });
  } catch (error) {
    console.error(
      "========== EMAIL LOGIN ERROR =========="
    );

    console.error(error);

    console.error(
      "======================================="
    );

    return res.status(500).json({
      error:
        "Login failed. Please try again.",
    });
  }
});

// =====================================================
// SEND OTP
// =====================================================
// OTP is generated locally and displayed on the website.
// =====================================================

router.post("/otp/send", async (req, res) => {
  try {
    const { phone } = req.body;

    // -------------------------------------------------
    // VALIDATE PHONE
    // -------------------------------------------------

    if (!phone) {
      return res.status(400).json({
        error: "Phone number is required.",
      });
    }

    const normalizedPhone = String(phone).trim();

    if (!isValidIndianPhone(normalizedPhone)) {
      return res.status(400).json({
        error: "Enter a valid 10-digit mobile number.",
      });
    }

    // -------------------------------------------------
    // GENERATE OTP
    // -------------------------------------------------

    const code = generateOtp();

    const expiresAt =
      Date.now() + 5 * 60 * 1000;

    // -------------------------------------------------
    // STORE OTP
    // -------------------------------------------------

    otpStore.set(normalizedPhone, {
      code,
      expiresAt,
    });

    // -------------------------------------------------
    // DEVELOPMENT / TESTING
    // -------------------------------------------------

    console.log(
      `📱 OTP for ${normalizedPhone}: ${code}`
    );

    // -------------------------------------------------
    // RETURN OTP TO WEBSITE
    // -------------------------------------------------

    return res.status(200).json({
      status: "sent",
      message: "OTP generated successfully.",
      otp: code,
    });

  } catch (error) {
    console.error(
      "========== OTP SEND ERROR =========="
    );

    console.error(error);

    console.error(
      "===================================="
    );

    return res.status(500).json({
      error:
        "Could not generate OTP. Please try again.",
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

    // -------------------------------------------------
    // VALIDATE INPUT
    // -------------------------------------------------

    if (!phone || !code) {
      return res.status(400).json({
        error:
          "Phone and code are required.",
      });
    }

    const normalizedPhone =
      String(phone).trim();

    const normalizedCode =
      String(code).trim();

    if (!isValidIndianPhone(normalizedPhone)) {
      return res.status(400).json({
        error:
          "Enter a valid 10-digit mobile number.",
      });
    }

    if (!/^\d{6}$/.test(normalizedCode)) {
      return res.status(400).json({
        error:
          "OTP must be a 6-digit code.",
      });
    }

    // -------------------------------------------------
    // GET OTP
    // -------------------------------------------------

    const record =
      otpStore.get(normalizedPhone);

    if (!record) {
      return res.status(400).json({
        error:
          "No OTP requested for this number.",
      });
    }

    // -------------------------------------------------
    // CHECK EXPIRATION
    // -------------------------------------------------

    if (Date.now() > record.expiresAt) {
      otpStore.delete(normalizedPhone);

      return res.status(400).json({
        error:
          "Code expired. Please request a new one.",
      });
    }

    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    if (record.code !== normalizedCode) {
      return res.status(400).json({
        error: "Incorrect code.",
      });
    }

    // OTP is valid.
    otpStore.delete(normalizedPhone);

    // -------------------------------------------------
    // FIND EXISTING PHONE USER
    // -------------------------------------------------

    let profile =
      await Profile.findOne({
        phone: normalizedPhone,
      });

    // -------------------------------------------------
    // CREATE USER IF NOT FOUND
    // -------------------------------------------------

    if (!profile) {
      let normalizedEmail = "";

      if (email?.trim()) {
        normalizedEmail =
          email.trim().toLowerCase();

        if (
          !isValidEmail(normalizedEmail)
        ) {
          return res.status(400).json({
            error:
              "Enter a valid email address.",
          });
        }
      }

      profile =
        await Profile.create({
          userId: generateUserId(),

          name:
            name?.trim() || "Guest",

          email: normalizedEmail,

          phone: normalizedPhone,

          provider: "phone",

          passwordHash: "",

          accountType: "Free",

          premiumCourses: [],

          active: true,
        });

      console.log(
        `✅ New phone user created: ${normalizedPhone}`
      );
    } else {
      // -------------------------------------------------
      // CHECK ACCOUNT STATUS
      // -------------------------------------------------

      if (profile.active === false) {
        return res.status(403).json({
          error:
            "This account has been disabled.",
        });
      }

      // -------------------------------------------------
      // UPDATE OPTIONAL INFORMATION
      // -------------------------------------------------

      let changed = false;

      if (
        name?.trim() &&
        (!profile.name ||
          profile.name === "Guest")
      ) {
        profile.name =
          name.trim();

        changed = true;
      }

      if (
        email?.trim() &&
        !profile.email
      ) {
        const normalizedEmail =
          email.trim().toLowerCase();

        if (
          !isValidEmail(normalizedEmail)
        ) {
          return res.status(400).json({
            error:
              "Enter a valid email address.",
          });
        }

        profile.email =
          normalizedEmail;

        changed = true;
      }

      if (changed) {
        await profile.save();
      }

      console.log(
        `✅ Existing phone user logged in: ${normalizedPhone}`
      );
    }

    // -------------------------------------------------
    // RETURN USER
    // -------------------------------------------------

    return res.status(200).json({
      status: "approved",

      message:
        "OTP verified successfully.",

      user: {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        provider: profile.provider,
        accountType: profile.accountType,
        premiumCourses:
          profile.premiumCourses || [],
      },
    });
  } catch (error) {
    console.error(
      "========== OTP VERIFY ERROR =========="
    );

    console.error(error);

    console.error(
      "======================================"
    );

    return res.status(500).json({
      error:
        "OTP verification failed. Please try again.",
    });
  }
});

// =====================================================
// LOGOUT
// =====================================================

router.post("/logout", async (req, res) => {
  try {
    const { userId } = req.body;

    console.log(
      "================================="
    );

    console.log(
      "Logout request received"
    );

    console.log(
      "User ID:",
      userId || "Not provided"
    );

    console.log(
      "================================="
    );

    return res.status(200).json({
      success: true,

      message:
        "Logout successful.",
    });
  } catch (error) {
    console.error(
      "========== LOGOUT ERROR =========="
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      error:
        "Logout failed. Please try again.",
    });
  }
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;