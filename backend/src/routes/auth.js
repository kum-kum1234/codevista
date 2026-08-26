const express = require("express");
const twilio = require("twilio");
const router = express.Router();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

router.post("/otp/send", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: "Phone number is required." });
  }
  if (!isValidIndianPhone(phone)) {
    return res.status(400).json({ error: "Enter a valid 10-digit mobile number." });
  }

  try {
    const verification = await client.verify.v2
      .services(verifyServiceSid)
      .verifications.create({ to: `+91${phone}`, channel: "sms" });

    res.json({ status: verification.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not send OTP. Please try again." });
  }
});

router.post("/otp/verify", async (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ error: "Phone and code are required." });
  }
  if (!isValidIndianPhone(phone)) {
    return res.status(400).json({ error: "Invalid phone number." });
  }

  try {
    const check = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({ to: `+91${phone}`, code });

    if (check.status === "approved") {
      return res.json({ status: "approved" });
    }
    return res.status(400).json({ error: "Incorrect or expired code." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not verify code. Please try again." });
  }
});

module.exports = router;