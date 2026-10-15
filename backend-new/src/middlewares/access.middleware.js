const Admin = require("../../models/Admin");

// Allows the request only when every userId it carries (params, query or
// body) is the logged-in user's own id. Must run after auth.middleware.
// If the body has no userId, the authenticated id is filled in.
const requireOwner = (req, res, next) => {
  const ownId = req.user && req.user.id;

  const supplied = [
    req.params && req.params.userId,
    req.query && req.query.userId,
    req.body && req.body.userId,
  ].filter((value) => value !== undefined && value !== "");

  if (!ownId || supplied.some((value) => String(value) !== ownId)) {
    return res.status(403).json({
      success: false,
      message: "You can only access your own data",
    });
  }

  if (req.body && typeof req.body === "object" && req.body.userId === undefined) {
    req.body.userId = ownId;
  }

  return next();
};

// Admin = an active record in the Admin collection. The admin token's subject
// is the adminId (issued by POST /api/admin/login), so a learner token never
// matches. Must run after auth.middleware.
const isAdminUser = async (adminId) => {
  if (!adminId) return false;

  return Boolean(await Admin.exists({ adminId: String(adminId), active: true }));
};

const requireAdmin = async (req, res, next) => {
  try {
    if (!(await isAdminUser(req.user && req.user.id))) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    return next();
  } catch (error) {
    console.error("Admin check failed:", error);
    return res.status(500).json({ success: false, message: "Authorization check failed" });
  }
};

module.exports = { requireOwner, requireAdmin, isAdminUser };
