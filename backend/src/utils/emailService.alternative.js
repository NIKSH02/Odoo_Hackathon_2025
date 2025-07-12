const nodemailer = require("nodemailer");

// Alternative email service configurations

// Option 1: Outlook/Hotmail
const createOutlookTransporter = () => {
  return nodemailer.createTransport({
    service: "outlook",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Option 2: Custom SMTP (like Mailtrap for testing)
const createSMTPTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.mailtrap.io", // For testing
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
};

// Option 3: Gmail with specific configuration
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password, not regular password
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

// Mock email service for development
const createMockTransporter = () => {
  return {
    sendMail: async (mailOptions) => {
      console.log("📧 Mock Email Sent:");
      console.log("To:", mailOptions.to);
      console.log("Subject:", mailOptions.subject);
      console.log("Text:", mailOptions.text);
      return { messageId: "mock-message-id" };
    },
  };
};

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email with fallback options
const sendOTPEmail = async (email, otp, purpose = "verification") => {
  try {
    // Use Gmail transporter for production
    const transporter = createGmailTransporter();

    // Fallback options (comment out the one above and uncomment below if needed):
    // const transporter = createMockTransporter(); // For development/testing
    // const transporter = createOutlookTransporter(); // For Outlook users
    // const transporter = createSMTPTransporter(); // For custom SMTP

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
