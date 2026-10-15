const jwt = require("jsonwebtoken");

// Issues the ACCESS token that src/middlewares/auth.middleware.js verifies.
// User tokens carry the profile's tokenVersion (tv) so logout can revoke them;
// admin tokens are signed without it.
function signAccessToken(userId, tokenVersion) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  const claims = { sub: String(userId), type: "ACCESS" };

  if (tokenVersion !== undefined) {
    claims.tv = tokenVersion || 0;
  }

  return jwt.sign(claims, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "7d",
  });
}

module.exports = { signAccessToken };
