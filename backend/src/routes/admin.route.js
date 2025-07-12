const router = require("express").Router();
const {
  getPendingItems,
  approveItem,
  rejectItem,
  removeItem,
} = require("../controllers/admin.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/admin.middleware");

// All admin routes are protected and require admin role
router.get("/items/pending", verifyJWT, isAdmin, getPendingItems); // List items pending approval
router.put("/items/:id/approve", verifyJWT, isAdmin, approveItem); // Approve item
router.put("/items/:id/reject", verifyJWT, isAdmin, rejectItem); // Reject item
router.delete("/items/:id", verifyJWT, isAdmin, removeItem); // Remove item

module.exports = router;
