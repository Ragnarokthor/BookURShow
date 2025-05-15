const router = require("express").Router();
require("dotenv").config(); // ✅ Load environment variables
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const authMiddleware = require("../middlewares/authMiddleware");
const Booking = require("../models/bookingModel");
const Show = require("../models/showModel");

// @route   POST /make-payment
// @desc    Create payment intent or charge with token
router.post("/make-payment", async (req, res) => {
  try {
    const { token, amount, mode } = req.body;

    if (mode === "create_intent") {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
        description: "Movie ticket booking",
      });

      return res.send({
        success: true,
        message: "Payment intent created",
        clientSecret: paymentIntent.client_secret,
      });
    }

    // Fallback if not using intent mode - token method
    if (!token || !token.email || !token.id) {
      return res.status(400).send({
        success: false,
        message: "Invalid token",
      });
    }

    const customer = await stripe.customers.create({
      email: token.email,
      source: token.id,
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      customer: customer.id,
      payment_method_types: ["card"],
      receipt_email: token.email,
      description: "Token has been assigned to the movie!",
    });

    const transactionId = paymentIntent.id;

    res.send({
      success: true,
      message: "Payment Successful! Ticket(s) booked!",
      data: transactionId,
    });
  } catch (err) {
    console.error("Stripe payment error:", err);
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
});

// @route   POST /book-show
// @desc    Book a show after successful payment
router.post("/book-show", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    const show = await Show.findById(req.body.show).populate("movie");
    const updatedBookedSeats = [...show.bookedSeats, ...req.body.seats];
    await Show.findByIdAndUpdate(req.body.show, { bookedSeats: updatedBookedSeats });

    res.send({
      success: true,
      message: "New Booking done!",
      data: newBooking,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
});

// @route   GET /get-all-bookings
// @desc    Get bookings for authenticated user
router.get("/get-all-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate("user")
      .populate({
        path: "show",
        populate: [
          { path: "movie", model: "movies" },
          { path: "theatre", model: "theatres" },
        ],
      });

    res.send({
      success: true,
      message: "Bookings fetched!",
      data: bookings,
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;
