//  ! IMPORTS
const express = require("express");
const {
  signupValidation,
  loginValidation,
  updatePasswordValidation,
  emailValidation,
  otpValidation,
} = require("../Middlewares/AuthValidation");

const { ensureAuthenticated } = require("../Middlewares/UserAuth");

const {
  signup,
  login,
  updatePassword,
  sendOtp,
  resetPassword,
} = require("../Controllers/AuthController");

const router = express.Router();

// @ COUNT       --> 1
// @ DESCRIPTION --> User Login
// @ ROUTE       --> auth/login
// @ METHOD      --> POST
router.post("/login", loginValidation, login);

// # COUNT       --> 2
// # DESCRIPTION --> User Signup
// # ROUTE       --> auth/signup
// # METHOD      --> POST
router.post("/signup", signupValidation, signup);

// $ COUNT       --> 3
// $ DESCRIPTION --> Change User Password
// $ ROUTE       --> auth/update-password
// $ METHOD      --> put
router.put(
  "/update-password",
  updatePasswordValidation,
  ensureAuthenticated,
  updatePassword
);

// ! COUNT       --> 4
// ! DESCRIPTION --> Send OTP to user email
// ! ROUTE       --> auth/send-otp
// ! METHOD      --> POST
router.post("/send-otp", emailValidation, sendOtp);

// @ COUNT       --> 5
// @DESCRIPTION --> reset user password
// @ ROUTE      --> auth/reset-password
// @ METHOD     --> POST
router.post("/reset-password", otpValidation, resetPassword);

module.exports = router;
