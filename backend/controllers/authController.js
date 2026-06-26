const jwt = require("jsonwebtoken");
const User = require("../models/User");
const generateOTP = require("../utils/otpGenerator");
const sendEmail = require("../utils/sendEmail");
// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || "RentEaseSuperSecretJWTSecretKey2026!",
    {
      expiresIn: "30d",
    },
  );
};
// @desc    Register new user & send OTP
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      res.status(400);
      throw new Error("Please enter all fields");
    }
    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    // Create user (inactive/unverified)
    const user = await User.create({
      name,
      email,
      password,
      role,
      isVerified: false,
      otp,
      otpExpiry,
    });
    if (user) {
      // real OTP Email Sending

      await sendEmail(
        email,
        "Verify your RentEase Account",
        `Your RentEase verification OTP is: ${otp}`,
      );
      res.status(201).json({
        success: true,
        message: "Registration successful. OTP sent to email.",
        email: user.email,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  } catch (error) {
    next(error);
  }
};
// @desc    Verify OTP to activate account
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      res.status(400);
      throw new Error("Please provide email and OTP");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.isVerified) {
      res.status(400);
      throw new Error("Account is already verified. Please login.");
    }
    // Check OTP and Expiry
    if (user.otp !== otp) {
      res.status(400);
      throw new Error("Invalid OTP code");
    }
    if (new Date() > user.otpExpiry) {
      res.status(400);
      throw new Error(
        "OTP has expired. Please sign up again or request a new code.",
      );
    }
    // Mark user as verified
    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Account verified successfully. You can now login.",
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      res.status(400);
      throw new Error("Please fill in all fields (email, password, role)");
    }
    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    // Check if role matches
    if (user.role !== role) {
      res.status(403);
      throw new Error(`Role mismatch. You registered as a ${user.role}.`);
    }
    // Match password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }
    // Check if verified
    if (!user.isVerified) {
      // Re-trigger OTP code
      const otp = generateOTP();
      user.otp = otp;
      user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();
      await sendEmail(
        email,
        "Verify your RentEase Account",
        `Your RentEase verification OTP is: ${otp}`,
      );
      return res.status(403).json({
        success: false,
        isVerified: false,
        message: "Account not verified. A new OTP has been sent to your email.",
        email: user.email,
      });
    }
    res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Forgot password -> send reset OTP/token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error("Please provide email");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("No account found with this email");
    }
    const resetToken = generateOTP(); // 6-digit numeric token is simpler and fits nicely into standard OTP box
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();
    await sendEmail(
      email,
      "Reset RentEase Password",
      `Your password reset verification OTP is: ${resetToken}`,
    );
    res.status(200).json({
      success: true,
      message: "Password reset OTP has been sent to your email.",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Reset password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
  try {
    const { email, token, newPassword } = req.body;
    if (!email || !token || !newPassword) {
      res.status(400);
      throw new Error("Please provide email, token/OTP and new password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    if (user.resetPasswordToken !== token) {
      res.status(400);
      throw new Error("Invalid reset token");
    }
    if (new Date() > user.resetPasswordExpiry) {
      res.status(400);
      throw new Error("Reset token has expired");
    }
    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;
    await user.save();
    res.status(200).json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    next(error);
  }
};
// @desc    Get current user details
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  getMe,
};
