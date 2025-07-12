const router = require("express").Router();
const {
  registerUser,
  verifyEmailOTP,
  resendEmailOTP,
  loginUser,
  sendLoginOTP,
  loginWithOTP,
  logoutUser,
  getCurrentUser,
  refreshToken,
} = require("../controllers/user.controller");
const verifyJWT = require("../middlewares/auth.middleware");

// Authentication Routes
router.post("/register", registerUser); // Register a new user
router.post("/verify-email", verifyEmailOTP); // Verify email with OTP
router.post("/resend-email-otp", resendEmailOTP); // Resend email verification OTP

// Login Routes
router.post("/login", loginUser); // Login with email and password
router.post("/send-login-otp", sendLoginOTP); // Send OTP for login
router.post("/login-with-otp", loginWithOTP); // Login with OTP

// Protected Routes
router.post("/logout", verifyJWT, logoutUser); // Logout user
router.post("/refresh-token", refreshToken); // Refresh access token
router.get("/profile", verifyJWT, getCurrentUser); // Get current user profile

module.exports = router;
