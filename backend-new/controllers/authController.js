// =====================================================
// AUTH CONTROLLER
// =====================================================

// Brevo and Axios removed.
// OTP is generated locally and returned to the website.

const otpStore = new Map(); // phone -> { code, expiresAt }


// =====================================================
// VALIDATE INDIAN PHONE
// =====================================================

function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}


// =====================================================
// GENERATE OTP
// =====================================================

function generateOtp() {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}


// =====================================================
// SEND OTP
// =====================================================
// OTP is generated locally.
// No Brevo or SMS service is used.
// OTP is returned to the website for testing.
// =====================================================

const sendOtp = async (req, res) => {
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

    const normalizedPhone =
      String(phone).trim();

    if (!isValidIndianPhone(normalizedPhone)) {
      return res.status(400).json({
        error:
          "Enter a valid 10-digit mobile number.",
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
    // DISPLAY OTP IN BACKEND CONSOLE
    // -------------------------------------------------

    console.log(
      `📱 OTP for ${normalizedPhone}: ${code}`
    );

    // -------------------------------------------------
    // RETURN OTP TO WEBSITE
    // -------------------------------------------------

    return res.status(200).json({
      status: "sent",
      message:
        "OTP generated successfully.",
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
};


// =====================================================
// VERIFY OTP
// =====================================================

const verifyOtp = (req, res) => {
  const { phone, code } = req.body;

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

  // -------------------------------------------------
  // VALIDATE PHONE
  // -------------------------------------------------

  if (!isValidIndianPhone(normalizedPhone)) {
    return res.status(400).json({
      error:
        "Enter a valid 10-digit mobile number.",
    });
  }

  // -------------------------------------------------
  // VALIDATE OTP FORMAT
  // -------------------------------------------------

  if (!/^\d{6}$/.test(normalizedCode)) {
    return res.status(400).json({
      error:
        "OTP must be a 6-digit code.",
    });
  }

  // -------------------------------------------------
  // GET STORED OTP
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
  // CHECK OTP EXPIRATION
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

  // -------------------------------------------------
  // OTP VERIFIED
  // -------------------------------------------------

  otpStore.delete(normalizedPhone);

  console.log(
    `✅ OTP verified for ${normalizedPhone}`
  );

  return res.status(200).json({
    status: "approved",
    message:
      "OTP verified successfully.",
  });
};


// =====================================================
// EXPORT CONTROLLER
// =====================================================

module.exports = {
  sendOtp,
  verifyOtp,
};