// Utility function to clear authentication data
export const clearAuthData = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
  console.log("Authentication data cleared");
};

// Function to check if user is logged in
export const isLoggedIn = () => {
  const token = localStorage.getItem("accessToken");
  const user = localStorage.getItem("user");
  return !!(token && user);
};
