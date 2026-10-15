const express = require("express");
//const axios = require("axios");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const { OAuth2Client } = require("google-auth-library");

const Profile = require("../models/Profile");
const Otp = require("../models/Otp");
const authMiddleware = require("../src/middlewares/auth.middleware");
const { sendOtpSms } = require("../services/smsService");
const { signAccessToken } = require("../utils/token");
const {
  authLimiter,
  otpLimiter,
} = require("../src/middlewares/rateLimit.middleware");

const router = express.Router();

router.use(["/register", "/login"], authLimiter);
router.use("/otp", otpLimiter);

// =====================================================
// OTP STORAGE
// =====================================================

// OTPs live in MongoDB (models/Otp.js), not in process memory, so they
// work across serverless instances.

const OTP_MAX_ATTEMPTS = 5;
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 30 * 1000;

function hashOtp(phone, code) {
  return crypto
    .createHmac("sha256", process.env.JWT_SECRET || "")
    .update(`${phone}:${code}`)
    .digest("hex");
}

// =====================================================
// HELPERS
// =====================================================

function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function generateOtp() {
  return crypto.randomInt(100000, 1000000).toString();
}

function generateUserId() {
  return crypto.randomUUID();
}

// bcrypt only uses the first 72 bytes, so longer passwords are rejected.
function validatePassword(password) {
  if (typeof password !== "string") {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (Buffer.byteLength(password) > 72) {
    return "Password is too long (max 72 characters).";
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }

  return null;
}

// Valid bcrypt hash of a throwaway string, used to equalise login timing.
const DUMMY_PASSWORD_HASH =
  "$2b$12$yUZkNAKDmxb2LYTWofOpN.Rmta7P9sd14hi/15Qvy4zzSOxuwtDZK";

function isDuplicateKeyError(error) {
  return error?.code === 11000;
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
    const { email, password, name, phone } = req.body;

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
    // VALIDATE PHONE
    // -------------------------------------------------

    const normalizedPhone = String(phone || "").trim();

    if (!isValidIndianPhone(normalizedPhone)) {
      return res.status(400).json({
        error: "Enter a valid 10-digit mobile number.",
      });
    }

    // -------------------------------------------------
    // VALIDATE PASSWORD
    // -------------------------------------------------

    const passwordError = validatePassword(password);

    if (passwordError) {
      return res.status(400).json({ error: passwordError });
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

    const phoneTaken = await Profile.findOne({
      phone: normalizedPhone,
      active: true,
    });

    if (phoneTaken) {
      return res.status(409).json({
        error: "An account with this phone number already exists.",
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

    let profile;

    try {
      profile = await Profile.create({
        userId: generateUserId(),

        name: finalName,

        email: normalizedEmail,

        phone: normalizedPhone,

        provider: "email",

        passwordHash,

        accountType: "Free",

        premiumCourses: [],

        active: true,
      });
    } catch (createError) {
      // Two simultaneous sign-ups hit the unique index.
      if (isDuplicateKeyError(createError)) {
        const field = createError.keyPattern?.phone ? "phone number" : "email";

        return res.status(409).json({
          error: `An account with this ${field} already exists.`,
        });
      }

      throw createError;
    }

    console.log(
      `✅ New account created: ${normalizedEmail}`
    );

    // -------------------------------------------------
    // RETURN SAFE USER DATA
    // -------------------------------------------------

    return res.status(201).json({
      status: "success",

      message: "Account created successfully.",

      token: signAccessToken(profile.userId, profile.tokenVersion),

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
      // Spend the same time as a real check so timing doesn't reveal
      // whether the email exists.
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);

      console.log(
        `❌ Login failed. User not found: ${normalizedEmail}`
      );

      return res.status(401).json({
        error: "Invalid email or password.",
      });
    }

    // -------------------------------------------------
    // CHECK PASSWORD HASH
    // -------------------------------------------------
    // Same generic answer as "wrong password" so the response doesn't
    // reveal which sign-in method an account uses.

    if (!profile.passwordHash) {
      await bcrypt.compare(password, DUMMY_PASSWORD_HASH);

      console.log(
        `❌ No password hash found for: ${normalizedEmail}`
      );

      return res.status(401).json({
        error: "Invalid email or password.",
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
    // CHECK ACCOUNT STATUS (only after the password is proven)
    // -------------------------------------------------

    if (profile.active === false) {
      return res.status(403).json({
        error: "This account has been disabled.",
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

      token: signAccessToken(profile.userId, profile.tokenVersion),

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
// GOOGLE SIGN-IN
// =====================================================
// The browser sends the ID token Google issued. We verify its
// signature, audience and expiry with Google's public keys, and
// only trust the email if Google says it is verified.
// =====================================================

let googleClient;

router.post("/google", async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID is not configured");

      return res.status(503).json({
        error: "Google sign-in is not available right now.",
      });
    }

    if (!idToken || typeof idToken !== "string") {
      return res.status(400).json({
        error: "Google ID token is required.",
      });
    }

    googleClient =
      googleClient || new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    let payload;

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      payload = ticket.getPayload();
    } catch (verifyError) {
      return res.status(401).json({
        error: "Google sign-in could not be verified.",
      });
    }

    if (!payload?.email || payload.email_verified !== true) {
      return res.status(401).json({
        error: "Your Google email address is not verified.",
      });
    }

    const email = payload.email.trim().toLowerCase();

    let profile = await Profile.findOne({ email });
    let isNewUser = false;

    if (!profile) {
      isNewUser = true;

      try {
        profile = await Profile.create({
          userId: generateUserId(),
          name: payload.name?.trim() || email.split("@")[0],
          email,
          provider: "google",
          accountType: "Free",
          premiumCourses: [],
          active: true,
        });
      } catch (createError) {
        // A parallel request created it first - just use that one.
        if (!isDuplicateKeyError(createError)) throw createError;

        isNewUser = false;
        profile = await Profile.findOne({ email });

        if (!profile) throw createError;
      }
    }

    if (profile.active === false) {
      return res.status(403).json({
        error: "This account has been disabled.",
      });
    }

    return res.status(200).json({
      status: "success",
      isNewUser,
      token: signAccessToken(profile.userId, profile.tokenVersion),
      user: {
        userId: profile.userId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        provider: profile.provider,
        accountType: profile.accountType,
        premiumCourses: profile.premiumCourses || [],
      },
    });
  } catch (error) {
    console.error("========== GOOGLE LOGIN ERROR ==========");
    console.error(error);

    return res.status(500).json({
      error: "Google sign-in failed. Please try again.",
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
    // ONLY REGISTERED NUMBERS GET A WORKING CODE
    // -------------------------------------------------
    // The response is identical for unknown and disabled numbers so
    // this endpoint can't be used to find out who has an account.

    const existing = await Profile.findOne({
      phone: normalizedPhone,
    }).select("active");

    const canReceiveCode = Boolean(existing) && existing.active !== false;

    // -------------------------------------------------
    // GENERATE OTP
    // -------------------------------------------------

    const code = generateOtp();

    // -------------------------------------------------
    // RESEND COOLDOWN
    // -------------------------------------------------

    const previous = await Otp.findOne({
      phone: normalizedPhone,
    }).select("updatedAt");

    if (
      previous &&
      Date.now() - previous.updatedAt.getTime() < OTP_RESEND_COOLDOWN_MS
    ) {
      return res.status(429).json({
        error: "Please wait a little before requesting another code.",
      });
    }

    // -------------------------------------------------
    // STORE OTP (hashed, replaces any earlier code)
    // -------------------------------------------------

    await Otp.findOneAndUpdate(
      { phone: normalizedPhone },
      {
        codeHash: hashOtp(normalizedPhone, code),
        attempts: 0,
        expiresAt: new Date(Date.now() + OTP_TTL_MS),
      },
      { upsert: true, setDefaultsOnInsert: true }
    );

    // -------------------------------------------------
    // SEND SMS (code is never returned in the response)
    // -------------------------------------------------

    try {
      if (canReceiveCode) {
        await sendOtpSms(normalizedPhone, code);
      }
    } catch (smsError) {
      console.error("OTP SMS failed:", smsError.message);

      await Otp.deleteOne({ phone: normalizedPhone });

      return res.status(502).json({
        error: "Could not send the code. Please try again later.",
      });
    }

    return res.status(200).json({
      status: "sent",
      message: "OTP sent successfully.",
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

    // Count this attempt atomically before checking the code, so parallel
    // guesses cannot exceed the attempt limit.
    const record = await Otp.findOneAndUpdate(
      { phone: normalizedPhone },
      { $inc: { attempts: 1 } },
      { returnDocument: "after" }
    );

    if (!record) {
      return res.status(400).json({
        error:
          "No OTP requested for this number.",
      });
    }

    // -------------------------------------------------
    // CHECK EXPIRATION
    // -------------------------------------------------

    if (Date.now() > record.expiresAt.getTime()) {
      await Otp.deleteOne({ _id: record._id });

      return res.status(400).json({
        error:
          "Code expired. Please request a new one.",
      });
    }

    if (record.attempts > OTP_MAX_ATTEMPTS) {
      await Otp.deleteOne({ _id: record._id });

      return res.status(400).json({
        error: "Too many incorrect attempts. Please request a new code.",
      });
    }

    // -------------------------------------------------
    // CHECK OTP
    // -------------------------------------------------

    const expected = Buffer.from(record.codeHash);
    const actual = Buffer.from(hashOtp(normalizedPhone, normalizedCode));

    if (
      expected.length !== actual.length ||
      !crypto.timingSafeEqual(expected, actual)
    ) {
      return res.status(400).json({
        error: "Incorrect code.",
      });
    }

    // OTP is valid. Delete it atomically so it can only be used once.
    const consumed = await Otp.findOneAndDelete({ _id: record._id });

    if (!consumed) {
      return res.status(400).json({
        error: "This code has already been used.",
      });
    }

    // -------------------------------------------------
    // FIND EXISTING PHONE USER (no account is created here)
    // -------------------------------------------------

    const profile =
      await Profile.findOne({
        phone: normalizedPhone,
      });

    // Unknown / disabled numbers never receive a code, so this is
    // only a safety net - and it gives the same answer as a bad code.
    if (!profile || profile.active === false) {
      return res.status(400).json({
        error: "Incorrect code.",
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

    // -------------------------------------------------
    // RETURN USER
    // -------------------------------------------------

    return res.status(200).json({
      status: "approved",

      message:
        "OTP verified successfully.",

      token: signAccessToken(profile.userId, profile.tokenVersion),

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

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    // Bumping tokenVersion invalidates every token issued so far
    // (this device and any other), so a stolen token stops working too.
    await Profile.updateOne(
      { userId: req.user.id },
      { $inc: { tokenVersion: 1 } }
    );

    return res.status(200).json({
      success: true,
      message: "Logout successful.",
    });
  } catch (error) {
    console.error("========== LOGOUT ERROR ==========");
    console.error(error);

    return res.status(500).json({
      success: false,
      error: "Logout failed. Please try again.",
    });
  }
});

// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;