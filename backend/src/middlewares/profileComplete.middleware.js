const ApiError = require("../utils/apiError");

const checkProfileComplete = (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      throw new ApiError(401, "User not authenticated");
    }

    // Check if profile is complete
    const isComplete = user.fullName && 
                      user.phoneNumber && 
                      user.address && 
                      user.state && 
                      user.country && 
                      user.pinCode &&
                      user.isEmailVerified;

    if (!isComplete) {
      const missingFields = getMissingFields(user);
      throw new ApiError(400, 
        `Please complete your profile before performing this action. Missing fields: ${missingFields.join(", ")}. ` +
        `Update your profile at PUT /api/users/profile`);
    }

    next();
  } catch (error) {
    next(error);
  }
};

const getMissingFields = (user) => {
  const missing = [];
  
  if (!user.fullName) missing.push("Full Name");
  if (!user.phoneNumber) missing.push("Phone Number");
  if (!user.address) missing.push("Address");
  if (!user.state) missing.push("State");
  if (!user.country) missing.push("Country");
  if (!user.pinCode) missing.push("Pin Code");
  if (!user.isEmailVerified) missing.push("Email Verification");
  
  return missing;
};

module.exports = checkProfileComplete;
