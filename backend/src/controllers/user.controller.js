const asynchandler = require("../utils/asynchandler");
const User = require("../models/User.model");
const apiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const {
  generateOTP,
  sendOTPEmail,
} = require("../utils/emailService.alternative");

// Helper function to generate tokens
const generateAccessTokenAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refresh_token = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (err) {
    throw new apiError(
      500,
      "Something went wrong while assigning access token and refresh token"
    );
  }
};

// Register User
const registerUser = asynchandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new apiError(400, "Please provide all the required details");
  }

  const existedUser = await User.findOne({
    $or: [{ email: email }, { username: username }],
  }).lean();

  if (existedUser) {
    throw new apiError(409, "User already exists");
  }

  // Generate OTP for email verification
  const emailOtp = generateOTP();
  const emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    username: username.toLowerCase(),
    email,
    password,
    emailOtp,
    emailOtpExpiry,
    isEmailVerified: false, // Require email verification
  });

  // Send OTP email
  const emailSent = await sendOTPEmail(email, emailOtp, "verification");

  if (!emailSent) {
    throw new apiError(500, "Failed to send verification email");
  }

  const createdUser = await User.findById(user._id).select(
    "-password -refresh_token -emailOtp -loginOtp"
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "User registered successfully. Please check your email for verification OTP."
      )
    );
});

// Verify Email OTP
const verifyEmailOTP = asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new apiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new apiError(400, "Email is already verified");
  }

  if (!user.otp || user.otp !== otp) {
    throw new apiError(400, "Invalid OTP");
  }

  if (new Date() > user.otpExpiry) {
    throw new apiError(400, "OTP has expired");
  }

  // Verify email
  user.isEmailVerified = true;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email verified successfully"));
});

// Resend Email Verification OTP
const resendEmailOTP = asynchandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (user.isEmailVerified) {
    throw new apiError(400, "Email is already verified");
  }

  const emailOtp = generateOTP();
  const emailOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.emailOtp = emailOtp;
  user.emailOtpExpiry = emailOtpExpiry;
  await user.save({ validateBeforeSave: false });

  const emailSent = await sendOTPEmail(email, emailOtp, "verification");

  if (!emailSent) {
    throw new apiError(500, "Failed to send verification email");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Verification OTP sent successfully"));
});

// Login User with Password
const loginUser = asynchandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new apiError(400, "Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (!user.isEmailVerified) {
    throw new apiError(400, "Please verify your email first");
  }

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new apiError(400, "Invalid credentials");
  }

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refresh_token -emailOtp -loginOtp"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, user: loggedInUser },
        "User logged in successfully"
      )
    );
});

// Send Login OTP
const sendLoginOTP = asynchandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new apiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (!user.isEmailVerified) {
    throw new apiError(400, "Please verify your email first");
  }

  const loginOtp = generateOTP();
  const loginOtpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  user.loginOtp = loginOtp;
  user.loginOtpExpiry = loginOtpExpiry;
  await user.save({ validateBeforeSave: false });

  const emailSent = await sendOTPEmail(email, loginOtp, "login");

  if (!emailSent) {
    throw new apiError(500, "Failed to send login OTP");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Login OTP sent successfully"));
});

// Login with OTP
const loginWithOTP = asynchandler(async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new apiError(400, "Email and OTP are required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new apiError(404, "User not found");
  }

  if (!user.isEmailVerified) {
    throw new apiError(400, "Please verify your email first");
  }

  if (!user.loginOtp || user.loginOtp !== otp) {
    throw new apiError(400, "Invalid OTP");
  }

  if (new Date() > user.loginOtpExpiry) {
    throw new apiError(400, "OTP has expired");
  }

  // Clear login OTP after successful verification
  user.loginOtp = undefined;
  user.loginOtpExpiry = undefined;
  await user.save({ validateBeforeSave: false });

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refresh_token -emailOtp -loginOtp"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, user: loggedInUser },
        "User logged in successfully"
      )
    );
});

// Logout User
const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refresh_token: "" },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

// Get Current User
const getCurrentUser = asynchandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -refresh_token")
    .lean();
  return res.status(200).json(new ApiResponse(200, user, "User details"));
});

// Refresh Token
const refreshToken = asynchandler(async (req, res) => {
  const { refreshToken } = req.cookies; // Get refresh token from cookies

  if (!refreshToken) {
    throw new apiError(401, "Session expired. Please log in again.");
  }

  // Find user by refresh token
  const user = await User.findOne({ refresh_token: refreshToken });

  if (!user) {
    throw new apiError(403, "Invalid refresh token. Please log in again.");
  }

  try {
    // Verify refresh token
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (decoded.id !== user._id.toString()) {
      throw new apiError(403, "Invalid refresh token. Please log in again.");
    }

    // Generate new tokens
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user._id);

    // Set new cookies
    const options = { httpOnly: true, secure: true };

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(200, { accessToken }, "New access token generated")
      );
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // Handle expired refresh token
      user.refresh_token = null; // Clear refresh token in DB
      await user.save({ validateBeforeSave: false });

      res.clearCookie("refreshToken"); // Clear cookies
      res.clearCookie("accessToken");

      throw new apiError(401, "Session expired. Please log in again.");
    }
    throw new apiError(403, "Invalid refresh token. Please log in again.");
  }
});

module.exports = {
  registerUser,
  verifyEmailOTP,
  resendEmailOTP,
  loginUser,
  sendLoginOTP,
  loginWithOTP,
  logoutUser,
  getCurrentUser,
  refreshToken,
};
