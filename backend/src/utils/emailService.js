const nodemailer = require("nodemailer");

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail", // You can change this to your email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Send OTP email
const sendOTPEmail = async (email, otp, purpose = "verification") => {
  try {
    const transporter = createTransporter();

    const subject =
      purpose === "login" ? "Login OTP" : "Email Verification OTP";
    const text =
      purpose === "login"
        ? `Your login OTP is: ${otp}. This OTP will expire in 10 minutes.`
        : `Your email verification OTP is: ${otp}. This OTP will expire in 10 minutes.`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      text: text,
      html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #333;">${subject}</h2>
                    <p>Your OTP is:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #2196F3; font-size: 32px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="color: #666;">This OTP will expire in 10 minutes.</p>
                    <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
};
