const User = require("../Modals/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

function generateUniqueOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   secure: true,
//   port: 465,
//   auth: {
//     user: "umesh@odespa.com",
//     pass: "0104@odespa",
//   },
// });

// @ COUNT       --> 1
// @ DESCRIPTION --> User Login
// @ ROUTE       --> auth/login
// @ METHOD      --> POST
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "Email does not exist",
        success: false,
      });
    }

    const isPasswordEqual = await bcrypt.compare(password, user.password);
    if (!isPasswordEqual) {
      return res.status(403).json({
        message: "Incorrect Password",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successfully",
      success: true,
      authToken: jwtToken,
      email,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// # COUNT       --> 2
// # DESCRIPTION --> User Signup
// # ROUTE       --> auth/signup
// # METHOD      --> POST
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User is already exist, you can login",
        success: false,
      });
    }

    const OTP = generateUniqueOTP();

    const userModal = new User({ name, email, password, otp: OTP });
    userModal.password = await bcrypt.hash(password, 10);
    await userModal.save();
    res.status(201).json({ message: "Signup successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// $ COUNT       --> 3
// $ DESCRIPTION --> Change User Password
// $ ROUTE       --> auth/update-password
// $ METHOD      --> put
const updatePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const isPasswordEqual = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordEqual) {
      return res
        .status(400)
        .json({ message: "Incorrect old password", success: false });
    }

    // user.password = newPassword;
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res
      .status(200)
      .json({ message: "Password updated successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

// ! COUNT       --> 4
// ! DESCRIPTION --> Send OTP to user email
// ! ROUTE       --> auth/send-otp
// ! METHOD      --> POST
const sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log("email-->", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Generate OTP
    // const otp = crypto.randomBytes(3).toString("hex").toUpperCase();
    const otp = generateUniqueOTP();

    user.otp = otp;
    await user.save();

    // Send OTP to user's email
    // const mailOptions = {
    //   from: "umesh@odespa.com",
    //   to: user.email,
    //   subject: "Password Reset OTP",
    //   text: `Your OTP for password reset is ${otp}`,
    // };

    // transporter.sendMail(mailOptions, (error, info) => {
    //   if (error) {
    //     return res.status(500).json({ message: "Error sending email" });
    //   }
    //   res.status(200).json({ message: "OTP sent to email" });
    // });
    res.status(200).json({ message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @ COUNT       --> 5
// @DESCRIPTION --> reset user password
// @ ROUTE      --> auth/reset-password
// @ METHOD     --> POST
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({
      email,
      otp,
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP", success: false });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    await user.save();

    res
      .status(200)
      .json({ message: "Password reset successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = {
  signup,
  login,
  updatePassword,
  sendOtp,
  resetPassword,
};
