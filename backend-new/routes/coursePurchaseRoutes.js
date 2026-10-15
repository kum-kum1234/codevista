const express = require("express");

const {
  createCourseCheckoutSession,
  getCoursePurchaseStatus,
} = require("../controllers/coursePurchaseController");

const auth = require("../src/middlewares/auth.middleware");
const { requireOwner } = require("../src/middlewares/access.middleware");

const router = express.Router();


// Create Stripe Checkout Session
router.post(
  "/checkout",
  auth,
  requireOwner,
  createCourseCheckoutSession
);


// Get whether user has access to a course
router.get(
  "/status/:courseId/:userId",
  auth,
  requireOwner,
  getCoursePurchaseStatus
);


module.exports = router;