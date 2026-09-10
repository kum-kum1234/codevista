const express = require("express");

const paymentController = require("../controllers/paymentController");

const router = express.Router();

// =====================================================
// ₹4,999 - COMPLETE PREMIUM
// =====================================================

router.post(
  "/create-checkout-session",
  paymentController.createCheckoutSession
);


// =====================================================
// ₹1,499 - INDIVIDUAL COURSE ACCESS
// =====================================================

router.post(
  "/create-course-checkout-session",
  paymentController.createCourseCheckoutSession
);


// =====================================================
// PAYMENT STATUS
// =====================================================

router.get(
  "/status/:sessionId",
  paymentController.getPaymentStatus
);

module.exports = router;