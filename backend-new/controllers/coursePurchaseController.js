const Stripe = require("stripe");
const CoursePurchase = require("../models/CoursePurchase");
const Course = require("../models/Course");
const Profile = require("../models/Profile");

// =====================================================
// STRIPE CONFIGURATION
// =====================================================

let stripe = null;

const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  if (!stripe) {
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  return stripe;
};

const COURSE_PRICE = 1499;
const COURSE_AMOUNT = 149900;
const CURRENCY = "inr";

// =====================================================
// CREATE COURSE CHECKOUT SESSION
// =====================================================

const createCourseCheckoutSession = async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required.",
      });
    }

    // -----------------------------------------------
    // Check whether user already has Premium
    // -----------------------------------------------

    const profile = await Profile.findOne({
      userId,
      active: true,
    });

    if (profile?.accountType === "Premium") {
      return res.status(400).json({
        success: false,
        code: "ALREADY_PREMIUM",
        message: "This account already has Premium access.",
      });
    }

    // -----------------------------------------------
    // Find course
    // -----------------------------------------------

    const course = await Course.findOne({
      courseId,
      active: { $ne: false },
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found.",
      });
    }

    // -----------------------------------------------
    // Check existing paid purchase
    // -----------------------------------------------

    const existingPurchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "paid",
      active: true,
    });

    if (existingPurchase) {
      return res.status(400).json({
        success: false,
        code: "COURSE_ALREADY_PURCHASED",
        message: "You already have access to this course.",
      });
    }

    // -----------------------------------------------
    // Get email from profile
    // -----------------------------------------------

    const customerEmail =
      profile?.email ||
      (typeof userId === "string" && userId.includes("@")
        ? userId
        : "");

    // -----------------------------------------------
    // Create Stripe Checkout Session
    // -----------------------------------------------

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      ...(customerEmail
        ? {
            customer_email: customerEmail,
          }
        : {}),

      line_items: [
        {
          price_data: {
            currency: CURRENCY,

            product_data: {
              name: course.title || "CodeVista Course",
              description:
                course.description ||
                `Full access to ${course.title || "this course"}`,
            },

            unit_amount: COURSE_AMOUNT,
          },

          quantity: 1,
        },
      ],

      metadata: {
        product: "Course",
        userId,
        courseId,
        courseTitle: course.title || "",
      },

      success_url:
        `${process.env.FRONTEND_URL || "http://localhost:5173"}` +
        `/courses/${encodeURIComponent(courseId)}` +
        `?payment=success&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${process.env.FRONTEND_URL || "http://localhost:5173"}` +
        `/courses/${encodeURIComponent(courseId)}` +
        `?payment=cancelled`,
    });

    // -----------------------------------------------
    // Save payment record
    // -----------------------------------------------

    const purchase = await CoursePurchase.create({
      userId,
      courseId,
      courseTitle: course.title || "",
      checkoutSessionId: session.id,
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : "",
      amount: COURSE_PRICE,
      currency: CURRENCY,
      plan: "Course",
      status: "created",
      active: true,
    });

    return res.status(201).json({
      success: true,
      message: "Course checkout session created.",
      url: session.url,
      sessionId: session.id,
      purchaseId: purchase._id,
    });
  } catch (error) {
    console.error(
      "Create course checkout session error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create course checkout session.",
    });
  }
};

// =====================================================
// GET COURSE PURCHASE STATUS
// =====================================================

const getCoursePurchaseStatus = async (req, res) => {
  try {
    const { courseId, userId } = req.params;

    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "User ID and course ID are required.",
      });
    }

    // -----------------------------------------------
    // Premium users automatically have access
    // -----------------------------------------------

    const profile = await Profile.findOne({
      userId,
      active: true,
    });

    if (profile?.accountType === "Premium") {
      return res.json({
        success: true,
        hasAccess: true,
        accessType: "Premium",
        purchased: false,
      });
    }

    const purchase = await CoursePurchase.findOne({
      userId,
      courseId,
      status: "paid",
      active: true,
    });

    return res.json({
      success: true,
      hasAccess: Boolean(purchase),
      accessType: purchase ? "Course Purchase" : null,
      purchased: Boolean(purchase),
      purchase: purchase
        ? {
            id: purchase._id,
            courseId: purchase.courseId,
            courseTitle: purchase.courseTitle,
            amount: purchase.amount,
            currency: purchase.currency,
            status: purchase.status,
            createdAt: purchase.createdAt,
          }
        : null,
    });
  } catch (error) {
    console.error(
      "Get course purchase status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to get course purchase status.",
    });
  }
};

// =====================================================
// ACTIVATE COURSE FROM STRIPE SESSION
// =====================================================

const activateCourseFromSession = async (
  session,
  eventId = ""
) => {
  const metadata = session.metadata || {};

  if (metadata.product !== "Course") {
    return {
      skipped: true,
      reason: "Not a course purchase",
    };
  }

  const userId = metadata.userId;
  const courseId = metadata.courseId;

  if (!userId || !courseId) {
    throw new Error(
      "Course payment metadata is missing userId or courseId."
    );
  }

  // -----------------------------------------------
  // Find purchase record
  // -----------------------------------------------

  const purchase = await CoursePurchase.findOne({
    checkoutSessionId: session.id,
  });

  if (!purchase) {
    throw new Error(
      `Course purchase not found for session ${session.id}`
    );
  }

  // -----------------------------------------------
  // Already processed
  // -----------------------------------------------

  if (purchase.status === "paid") {
    return {
      skipped: true,
      alreadyPaid: true,
      purchase,
    };
  }

  // -----------------------------------------------
  // Update CoursePurchase
  // -----------------------------------------------

  purchase.status = "paid";

  purchase.paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : purchase.paymentIntentId;

  purchase.stripeEventId =
    eventId || purchase.stripeEventId;

  purchase.active = true;

  await purchase.save();

  // -----------------------------------------------
  // Find user profile
  // -----------------------------------------------

  const profile = await Profile.findOne({
    userId,
    active: true,
  });

  if (!profile) {
    throw new Error(
      `Profile not found for userId: ${userId}`
    );
  }

  // -----------------------------------------------
  // Complete Premium users already have access
  // -----------------------------------------------

  if (profile.accountType === "Premium") {
    console.log(
      `ℹ️ ${userId} already has Complete Premium access.`
    );

    return {
      skipped: false,
      alreadyPremium: true,
      purchase,
    };
  }

  // -----------------------------------------------
  // Add course to premiumCourses
  // -----------------------------------------------

  const existingCourses = Array.isArray(
    profile.premiumCourses
  )
    ? profile.premiumCourses
    : [];

  if (!existingCourses.includes(courseId)) {
    profile.premiumCourses.push(courseId);
  }

  // -----------------------------------------------
  // Set individual course access
  // -----------------------------------------------

  profile.accountType = "CoursePremium";

  profile.subscription = {
    plan: "Course Access",

    description:
      "One-year access to the purchased CodeVista course",

    benefits: [
      `Access to ${purchase.courseTitle || courseId}`,
      "Access to all lessons in the purchased course",
      "Course progress tracking",
      "Course updates",
    ],

    price: COURSE_PRICE,

    period: "per annum",

    status: "active",
  };

  await profile.save();

  console.log(
    `✅ Course access activated for ${userId}: ${courseId}`
  );

  return {
    skipped: false,
    purchase,
    profile,
  };
};

// =====================================================
// MARK SESSION AS EXPIRED
// =====================================================

const expireCoursePurchaseFromSession = async (
  session,
  eventId = ""
) => {
  const purchase = await CoursePurchase.findOne({
    checkoutSessionId: session.id,
  });

  if (!purchase || purchase.status === "paid") {
    return;
  }

  purchase.status = "expired";

  purchase.stripeEventId =
    eventId || purchase.stripeEventId;

  await purchase.save();

  console.log(
    `Course checkout expired: ${purchase.courseId} / ${purchase.userId}`
  );
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createCourseCheckoutSession,
  getCoursePurchaseStatus,
  activateCourseFromSession,
  expireCoursePurchaseFromSession,
};