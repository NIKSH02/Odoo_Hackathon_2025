const router = require("express").Router();
const {
  getAllUsers,
  deleteUser,
  getAllItems,
  getAllOrders,
  getSwapPoints,
  updateSwapPoints,
} = require("../controllers/admin.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");

// All admin routes are protected and require admin role

// User Management
router.get("/users", verifyJWT, isAdmin, getAllUsers); // Get all users with pagination and filters
router.delete("/users/:id", verifyJWT, isAdmin, deleteUser); // Delete user and related data

// Item Management (listing only, no approval/rejection)
router.get("/items", verifyJWT, isAdmin, getAllItems); // Get all items with pagination and filters

// Order Management
router.get("/orders", verifyJWT, isAdmin, getAllOrders); // Get all orders with pagination and filters

// Swap Points Configuration
router.get("/points", verifyJWT, isAdmin, getSwapPoints); // Get current points configuration
router.put("/points", verifyJWT, isAdmin, updateSwapPoints); // Update swap points configuration

module.exports = router;
