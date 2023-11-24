const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const User = require("../models/user");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.post("/api/register", async (req, res) => {
  console.log(req.body)
  try {
    const { name, email, password, profileImage } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      profileImage,
    });

    user.verificationToken = crypto.randomBytes(20).toString("hex");
    // Save the user to the database
    await user.save();

    // Send a verification email
    await sendVerificationEmail(user.email, user.verificationToken);

    res.status(201).json({ message: "User registered successfully. Verification email sent." });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });
  }
});

const sendVerificationEmail = async (email, token) => {
  // Replace the placeholders with your actual email configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "linkedin@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `<p>Please click <a href="http://localhost:8000/verify/${token}">here</a> to verify your email.</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        reject(error);
      } else {
        console.log("Verification email sent:", info.response);
        resolve(info);
      }
    });
  });
};
router.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(404).json({ message: "User not found for the provided token" });
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.status(200).json({ message: "Email verification successful", user });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
});
// Login route
router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if the user is verified
    if (!user.verified) {
      return res.status(401).json({ message: "User is not verified. Please check your email for verification." });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
    );

    // Respond with the token
    res.status(200).json({ token, userId: user._id, message: "Login successful" });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

module.exports = router;
