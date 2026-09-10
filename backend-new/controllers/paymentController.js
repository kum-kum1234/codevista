const Stripe = require("stripe");
const Payment = require("../models/Payment");
const Profile = require("../models/Profile");

const {
  activateCourseFromSession,
  expireCoursePurchaseFromSession,
} = require("./coursePurchaseController");

const PREMIUM_AMOUNT = 499900;
const PREMIUM_PRICE = 4999;
const PREMIUM_CURRENCY = "inr";

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

const PREMIUM_BENEFITS = [
  "Access to all courses and updates",
  "Project files and source code downloads",
  "Live coding sessions with instructors",
  "Certificates upon course completion",
];


// =====================================================
// CREATE PREMIUM CHECKOUT SESSION
// =====================================================

async function createCheckoutSession(req, res) {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    const profile = await Profile.findOne({
      userId,
      active: true,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
        code: "PROFILE_NOT_FOUND",
      });
    }

    if (profile.accountType === "Premium") {
      return res.status(400).json({
        success: false,
        message: "This account already has Premium access.",
        code: "ALREADY_PREMIUM",
      });
    }

    const stripe = getStripe();

    const origin =
      req.headers.origin ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: PREMIUM_CURRENCY,

            product_data: {
              name: "CodeVista Premium",
              description:
                "Premium access to all CodeVista courses and features.",
            },

            unit_amount: PREMIUM_AMOUNT,
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId: String(userId),
        plan: "Premium",
        product: "CodeVista Premium",
      },

      success_url:
        `${origin}/profile?payment=success&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${origin}/profile?payment=cancelled`,

      customer_email: profile.email || undefined,
    });

    await Payment.create({
      userId,
      checkoutSessionId: session.id,

      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : "",

      amount: PREMIUM_PRICE,
      currency: PREMIUM_CURRENCY,
      plan: "Premium",
      status: "created",

      stripeCustomerId:
        typeof session.customer === "string"
          ? session.customer
          : "",
    });

    return res.status(201).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      amount: PREMIUM_PRICE,
      currency: PREMIUM_CURRENCY,
      plan: "Premium",
    });
  } catch (error) {
    console.error(
      "Create Stripe checkout session error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create Stripe checkout session.",
    });
  }
}
// =====================================================
// CREATE INDIVIDUAL COURSE CHECKOUT SESSION
// ₹1,499 = ACCESS TO ONE COURSE
// =====================================================

async function createCourseCheckoutSession(req, res) {
  try {
    const { userId, courseId, courseTitle } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required.",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required.",
      });
    }

    const profile = await Profile.findOne({
      userId,
      active: true,
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found.",
        code: "PROFILE_NOT_FOUND",
      });
    }

    // Complete Premium users already have access to every course.
    if (profile.accountType === "Premium") {
      return res.status(400).json({
        success: false,
        message: "This account already has Complete Premium access.",
        code: "ALREADY_PREMIUM",
      });
    }

    const stripe = getStripe();

    const origin =
      req.headers.origin ||
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          price_data: {
            currency: "inr",

            product_data: {
              name: `${courseTitle || "CodeVista Course"} - Course Access`,
              description:
                "One-year access to this CodeVista course.",
            },

            // ₹1,499
            unit_amount: 149900,
          },

          quantity: 1,
        },
      ],

      metadata: {
        userId: String(userId),
        courseId: String(courseId),
        plan: "CoursePremium",
        product: "Course",
      },

      success_url:
        `${origin}/courses/${encodeURIComponent(courseId)}?payment=success&session_id={CHECKOUT_SESSION_ID}`,

      cancel_url:
        `${origin}/courses/${encodeURIComponent(courseId)}?payment=cancelled`,

      customer_email: profile.email || undefined,
    });

    return res.status(201).json({
      success: true,
      sessionId: session.id,
      url: session.url,
      amount: 1499,
      currency: "inr",
      plan: "CoursePremium",
      courseId,
    });
  } catch (error) {
    console.error(
      "Create course Stripe checkout session error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to create course checkout session.",
    });
  }
}

// =====================================================
// STRIPE WEBHOOK
// =====================================================

async function handleStripeWebhook(req, res) {
  const stripe = getStripe();

  const signature = req.headers["stripe-signature"];

  if (!signature) {
    return res.status(400).json({
      success: false,
      message: "Missing Stripe signature.",
    });
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not configured."
    );

    return res.status(500).json({
      success: false,
      message: "Stripe webhook secret is not configured.",
    });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error.message
    );

    return res.status(400).json({
      success: false,
      message: `Webhook Error: ${error.message}`,
    });
  }

  try {
    switch (event.type) {

      // =================================================
      // CHECKOUT COMPLETED
      // Handles BOTH Premium and Course payments
      // =================================================

      case "checkout.session.completed": {
        const session = event.data.object;

        const product = session.metadata?.product;

        // -----------------------------------------------
        // Individual Course Purchase
        // -----------------------------------------------

        if (product === "Course") {
          await activateCourseFromSession(
            session,
            event.id
          );

          break;
        }

        // -----------------------------------------------
        // Premium Purchase
        // -----------------------------------------------

        if (product === "CodeVista Premium") {
          await activatePremiumFromSession(
            session,
            event.id
          );

          break;
        }

        console.log(
          `Unknown Stripe product: ${product || "none"}`
        );

        break;
      }


      // =================================================
      // CHECKOUT EXPIRED
      // =================================================

      case "checkout.session.expired": {
        const session = event.data.object;

        const product = session.metadata?.product;

        // Individual course
        if (product === "Course") {
          await expireCoursePurchaseFromSession(
            session,
            event.id
          );

          break;
        }

        // Premium
        await Payment.findOneAndUpdate(
          {
            checkoutSessionId: session.id,
          },
          {
            status: "expired",
            stripeEventId: event.id,
          }
        );

        break;
      }


      // =================================================
      // PAYMENT FAILED
      // Handles both Premium and Course
      // =================================================

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;

        // -----------------------------------------------
        // Premium payment
        // -----------------------------------------------

        const premiumPayment =
          await Payment.findOneAndUpdate(
            {
              paymentIntentId: paymentIntent.id,
            },
            {
              status: "failed",
              stripeEventId: event.id,
            },
            {
              new: true,
            }
          );

        if (premiumPayment) {
          break;
        }

        // -----------------------------------------------
        // Course payment
        // -----------------------------------------------

        const CoursePurchase = require(
          "../models/CoursePurchase"
        );

        await CoursePurchase.findOneAndUpdate(
          {
            paymentIntentId: paymentIntent.id,
          },
          {
            status: "failed",
            stripeEventId: event.id,
          }
        );

        break;
      }


      // =================================================
      // OTHER STRIPE EVENTS
      // =================================================

      default:
        console.log(
          `Unhandled Stripe event: ${event.type}`
        );
    }

    return res.json({
      received: true,
    });

  } catch (error) {
    console.error(
      "Stripe webhook processing error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Webhook processing failed.",
    });
  }
}


// =====================================================
// ACTIVATE PREMIUM FROM STRIPE SESSION
// =====================================================

async function activatePremiumFromSession(
  session,
  eventId
) {
  const userId = session.metadata?.userId;

  if (!userId) {
    throw new Error(
      "Stripe checkout session does not contain userId."
    );
  }

  const payment = await Payment.findOne({
    checkoutSessionId: session.id,
  });

  if (payment?.status === "paid") {
    return;
  }

  await Payment.findOneAndUpdate(
    {
      checkoutSessionId: session.id,
    },
    {
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : payment?.paymentIntentId || "",

      stripeCustomerId:
        typeof session.customer === "string"
          ? session.customer
          : payment?.stripeCustomerId || "",

      status: "paid",

      stripeEventId: eventId,
    },
    {
      new: true,
    }
  );

  const updatedProfile =
    await Profile.findOneAndUpdate(
      {
        userId,
        active: true,
      },
      {
        $set: {
          accountType: "Premium",

          subscription: {
            plan: "Premium",

            description:
              "Premium access to all CodeVista courses and features",

            benefits: PREMIUM_BENEFITS,

            price: PREMIUM_PRICE,

            period: "per annum",

            status: "active",
          },
        },
      },
      {
        new: true,
      }
    );

  if (!updatedProfile) {
    throw new Error(
      `Profile not found for userId: ${userId}`
    );
  }

  console.log(
    `✅ Premium activated for ${userId}`
  );
}


// =====================================================
// GET PREMIUM PAYMENT STATUS
// =====================================================

async function getPaymentStatus(req, res) {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required.",
      });
    }

    const payment = await Payment.findOne({
      checkoutSessionId: sessionId,
    }).lean();

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found.",
      });
    }

    return res.json({
      success: true,

      payment: {
        id: payment._id,

        userId: payment.userId,

        checkoutSessionId:
          payment.checkoutSessionId,

        paymentIntentId:
          payment.paymentIntentId,

        amount: payment.amount,

        currency: payment.currency,

        plan: payment.plan,

        status: payment.status,
      },
    });

  } catch (error) {
    console.error(
      "Get payment status error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to get payment status.",
    });
  }
}


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  createCheckoutSession,
  createCourseCheckoutSession,
  handleStripeWebhook,
  getPaymentStatus,
};