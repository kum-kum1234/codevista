const express = require("express");
const Stripe = require("stripe");

const {
  activateCourseFromSession,
  expireCoursePurchaseFromSession,
} = require("../controllers/coursePurchaseController");

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// =====================================================
// STRIPE WEBHOOK
// =====================================================

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    // -------------------------------------------------
    // VERIFY STRIPE WEBHOOK
    // -------------------------------------------------

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error(
        "❌ Stripe webhook signature verification failed:"
      );

      console.error(error.message);

      return res.status(400).send(
        `Webhook Error: ${error.message}`
      );
    }

    // -------------------------------------------------
    // HANDLE STRIPE EVENT
    // -------------------------------------------------

    try {
      console.log(
        `📩 Stripe event received: ${event.type}`
      );

      // =================================================
      // PAYMENT SUCCESSFUL
      // =================================================

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        console.log(
          "💳 Stripe payment completed:"
        );

        console.log(
          "Session ID:",
          session.id
        );

        console.log(
          "Payment status:",
          session.payment_status
        );

        // ------------------------------------------------
        // ACTIVATE COURSE
        // ------------------------------------------------

        await activateCourseFromSession(
          session,
          event.id
        );

        console.log(
          "✅ Course activation completed."
        );
      }

      // =================================================
      // CHECKOUT SESSION EXPIRED
      // =================================================

      else if (
        event.type ===
        "checkout.session.expired"
      ) {
        const session = event.data.object;

        console.log(
          "⚠️ Stripe checkout session expired:",
          session.id
        );

        await expireCoursePurchaseFromSession(
          session,
          event.id
        );

        console.log(
          "✅ Expired purchase updated."
        );
      }

      // =================================================
      // OTHER EVENTS
      // =================================================

      else {
        console.log(
          `ℹ️ Stripe event ignored: ${event.type}`
        );
      }

      // -------------------------------------------------
      // TELL STRIPE WEBHOOK WAS RECEIVED
      // -------------------------------------------------

      return res.status(200).json({
        received: true,
      });

    } catch (error) {
      console.error(
        "❌ Stripe webhook processing failed:"
      );

      console.error(error);

      return res.status(500).json({
        error:
          "Stripe webhook processing failed.",
      });
    }
  }
);

module.exports = router;