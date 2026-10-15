const express = require("express");

const paymentController = require("../controllers/paymentController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router = express.Router();

// =====================================================
// ₹4,999 - COMPLETE PREMIUM
// =====================================================

router.post(
  "/create-checkout-session",
  auth,
  requireOwner,
  paymentController.createCheckoutSession
);


// =====================================================
// ₹1,499 - INDIVIDUAL COURSE ACCESS
// =====================================================

router.post(
  "/create-course-checkout-session",
  auth,
  requireOwner,
  paymentController.createCourseCheckoutSession
);


// =====================================================
// PAYMENT STATUS
// =====================================================

router.get(
  "/status/:sessionId",
  auth,
  paymentController.getPaymentStatus
);

module.exports = router;