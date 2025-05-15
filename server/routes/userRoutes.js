const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
require("dotenv").config(); // ✅ Load env variables

// @route   POST /register
// @desc    Register a new user
router.post("/register", async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.send({
        success: false,
        message: "The user already exists!",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hashedPassword;

    // Create and save new user
    const newUser = new User(req.body);
    await newUser.save();

    res.send({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      success: false,
      message: "Something went wrong while registering user.",
    });
  }
});

// @route   POST /login
// @desc    Login a user and return JWT
router.post("/login", async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist. Please register.",
      });
    }

    // Validate password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).send({
        success: false,
        message: "Sorry, invalid password entered!",
      });
    }

    // Generate JWT using secret from .env
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.send({
      success: true,
      message: "You've successfully logged in!",
      token: jwtToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong during login.",
    });
  }
});

// @route   GET /get-valid-user
// @desc    Verify token and return user info
router.get("/get-valid-user", authMiddleware, async (req, res) => {
  try {
    const validUser = await User.findById(req.userId).select("-password");

    res.send({
      success: true,
      message: "You are authorized to go to the protected route!",
      data: validUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({
      success: false,
      message: "Failed to fetch valid user",
    });
  }
});

module.exports = router;
