const express = require("express");

const {
  createCourseCheckoutSession,
  getCoursePurchaseStatus,
} = require("../controllers/coursePurchaseController");

const router = express.Router();


// Create Stripe Checkout Session
router.post(
  "/checkout",
  createCourseCheckoutSession
);


// Get whether user has access to a course
router.get(
  "/status/:courseId/:userId",
  getCoursePurchaseStatus
);


module.exports = router;