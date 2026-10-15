const rateLimit = require("express-rate-limit");

const build = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    limit: max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { success: false, error: message },
  });

module.exports = {
  // login / register / logout
  authLimiter: build(15, 20, "Too many attempts. Please try again later."),
  // OTP send + verify
  otpLimiter: build(15, 10, "Too many OTP requests. Please try again later."),
};
