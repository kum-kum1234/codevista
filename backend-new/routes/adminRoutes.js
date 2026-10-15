const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const { signAccessToken } = require("../utils/token");
const auth = require("../src/middlewares/auth.middleware");
const { requireAdmin } = require("../src/middlewares/access.middleware");
const { authLimiter } = require("../src/middlewares/rateLimit.middleware");

const router = express.Router();

router.use(["/register", "/login"], authLimiter);

const MIN_PASSWORD_LENGTH = 8;

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const safeAdmin = (admin) => ({
  adminId: admin.adminId,
  name: admin.name,
  email: admin.email,
});

// The very first admin can register openly (bootstrap). After that, only a
// signed-in admin can create more admins.
const firstAdminOrAdmin = async (req, res, next) => {
  try {
    const adminCount = await Admin.estimatedDocumentCount();

    if (adminCount === 0) {
      return next();
    }

    return auth(req, res, () => requireAdmin(req, res, next));
  } catch (error) {
    console.error("Admin register check failed:", error);

    return res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
};

// =====================================================
// REGISTER ADMIN
// =====================================================

router.post("/register", firstAdminOrAdmin, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "Name, email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!isValidEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        error: "Enter a valid email address.",
      });
    }

    if (String(password).length < MIN_PASSWORD_LENGTH) {
      return res.status(400).json({
        success: false,
        error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
      });
    }

    const existing = await Admin.exists({ email: normalizedEmail });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: "An admin with this email already exists.",
      });
    }

    const admin = await Admin.create({
      adminId: crypto.randomUUID(),
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash: await bcrypt.hash(String(password), 12),
    });

    return res.status(201).json({
      success: true,
      message: "Admin created successfully.",
      token: signAccessToken(admin.adminId),
      admin: safeAdmin(admin),
    });
  } catch (error) {
    console.error("Admin register error:", error);

    return res.status(500).json({
      success: false,
      error: "Registration failed. Please try again.",
    });
  }
});

// =====================================================
// LOGIN ADMIN
// =====================================================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Email and password are required.",
      });
    }

    const admin = await Admin.findOne({
      email: String(email).trim().toLowerCase(),
      active: true,
    }).select("+passwordHash");

    const valid =
      admin && (await bcrypt.compare(String(password), admin.passwordHash));

    if (!valid) {
      return res.status(401).json({
        success: false,
        error: "Invalid email or password.",
      });
    }

    return res.status(200).json({
      success: true,
      token: signAccessToken(admin.adminId),
      admin: safeAdmin(admin),
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return res.status(500).json({
      success: false,
      error: "Login failed. Please try again.",
    });
  }
});

// =====================================================
// CURRENT ADMIN
// =====================================================

router.get("/me", auth, requireAdmin, async (req, res) => {
  try {
    const admin = await Admin.findOne({
      adminId: req.user.id,
      active: true,
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        error: "Admin not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin: safeAdmin(admin),
    });
  } catch (error) {
    console.error("Admin me error:", error);

    return res.status(500).json({
      success: false,
      error: "Failed to fetch admin.",
    });
  }
});

module.exports = router;
