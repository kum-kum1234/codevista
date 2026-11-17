
const jwt = require("jsonwebtoken");
const Profile = require("../../models/Profile");

module.exports = async (req, res, next) => {
  try {
    // 1. Check Authorization header
    const authorization = req.headers.authorization;

    const token =
      authorization && authorization.startsWith("Bearer ")
        ? authorization.slice(7)
        : null;

    if (!token) {
      console.error(
        "[AUTH] Missing Bearer token:",
        req.method,
        req.originalUrl
      );

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    // 2. Check JWT secret configuration
    if (!process.env.JWT_SECRET) {
      console.error("[AUTH] JWT_SECRET is not configured");

      return res.status(500).json({
        success: false,
        message: "Authentication service configuration error",
      });
    }

    // 3. Verify JWT
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. Validate token type
    if (payload.type !== "ACCESS") {
      console.error("[AUTH] Invalid token type");

      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    // 5. Validate token subject
    if (!payload.sub) {
      console.error("[AUTH] Token subject is missing");

      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // 6. Validate user token version
    // Admin tokens do not contain the tv claim.
    if (payload.tv !== undefined) {
      const profile = await Profile.findOne({
        userId: String(payload.sub),
      })
        .select("tokenVersion active")
        .lean();

      if (!profile) {
        console.error(
          "[AUTH] Profile not found:",
          payload.sub
        );

        return res.status(401).json({
          success: false,
          message: "User account not found",
        });
      }

      if (profile.active === false) {
        console.error(
          "[AUTH] Inactive account:",
          payload.sub
        );

        return res.status(403).json({
          success: false,
          message: "Your account is inactive",
        });
      }

      const databaseVersion = profile.tokenVersion || 0;

      if (databaseVersion !== payload.tv) {
        console.error("[AUTH] Token version mismatch:", {
          userId: payload.sub,
          databaseVersion,
          tokenVersion: payload.tv,
        });

        return res.status(401).json({
          success: false,
          message: "Session expired. Please log in again.",
        });
      }
    }

    // 7. Attach authenticated user to request
    req.user = {
      id: String(payload.sub),
    };

    // 8. Continue to the next middleware or route
    return next();

  } catch (error) {
    // Handle expired JWT separately
    if (error.name === "TokenExpiredError") {
      console.error("[AUTH] Token expired");

      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again.",
      });
    }

    // Handle malformed or invalid JWT
    if (error.name === "JsonWebTokenError") {
      console.error(
        "[AUTH] Invalid JWT:",
        error.message
      );

      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
      });
    }

    // Handle unexpected errors
    console.error(
      "[AUTH] Middleware error:",
      error.message
    );

    return res.status(500).json({
      success: false,
      message: "Authentication verification failed",
    });
  }
};
