const express = require("express");
const axios = require("axios");

const router = express.Router();

const otpStore = new Map(); // phone -> { code, expiresAt }

function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/otp/send", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      error: "Phone number is required."
    });
  }

  if (!isValidIndianPhone(phone)) {
    return res.status(400).json({
      error: "Enter a valid 10-digit mobile number."
    });
  }

  const code = generateOtp();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  otpStore.set(phone, {
    code,
    expiresAt
  });

  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/transactionalSMS/send",
      {
        sender: process.env.BREVO_SENDER_NAME,
        recipient: `91${phone}`,
        content: `Your CodeVista OTP is ${code}. Valid for 5 minutes.`,
        type: "transactional"
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "accept": "application/json",
          "content-type": "application/json"
        }
      }
    );

    console.log("Brevo response:", response.data);

    return res.status(200).json({
  status: "sent",
  message: "OTP generated successfully",
  otp: code
});

  } catch (err) {
    console.error("========== BREVO ERROR ==========");
    console.error("Status:", err.response?.status);
    console.error("Data:", err.response?.data);
    console.error("Message:", err.message);
    console.error("=================================");

    return res.status(500).json({
      error: "Could not send OTP. Please try again."
    });
  }
});

router.post("/otp/verify", (req, res) => {
  const { phone, code } = req.body;

  if (!phone || !code) {
    return res.status(400).json({
      error: "Phone and code are required."
    });
  }

  const record = otpStore.get(phone);

  if (!record) {
    return res.status(400).json({
      error: "No OTP requested for this number."
    });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);

    return res.status(400).json({
      error: "Code expired. Please request a new one."
    });
  }

  if (record.code !== code) {
    return res.status(400).json({
      error: "Incorrect code."
    });
  }

  otpStore.delete(phone);

  return res.json({
    status: "approved"
  });
});

module.exports = router;