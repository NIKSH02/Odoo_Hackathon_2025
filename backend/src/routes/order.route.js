const router = require("express").Router();
const {
  getUserOrders,
  getOrderById,
  completeOrder,
  cancelOrder,
  getOrderByCode,
  getUserVerificationCodes,
} = require("../controllers/order.controller");
const verifyJWT = require("../middlewares/auth.middleware");

// All order routes are protected
router.get("/", verifyJWT, getUserOrders); // Get user's orders
router.get("/:id", verifyJWT, getOrderById); // Get order by ID
router.get("/:id/codes", verifyJWT, getUserVerificationCodes); // Get user's verification codes for order
router.get("/code/:orderCode", verifyJWT, getOrderByCode); // Get order by order code
router.put("/:id/complete", verifyJWT, completeOrder); // Mark order as complete with code verification
router.put("/:id/cancel", verifyJWT, cancelOrder); // Cancel order

module.exports = router;
