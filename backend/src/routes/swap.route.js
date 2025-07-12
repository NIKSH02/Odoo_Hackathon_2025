const router = require("express").Router();
const {
  requestSwap,
  getUserSwaps,
  acceptSwap,
  rejectSwap,
  completeSwap,
} = require("../controllers/swap.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const checkProfileComplete = require("../middlewares/profileComplete.middleware");

// All swap routes are protected
router.post("/request", verifyJWT, checkProfileComplete, requestSwap); // Request swap
router.get("/", verifyJWT, getUserSwaps); // List user swaps
router.put("/:id/accept", verifyJWT, checkProfileComplete, acceptSwap); // Accept swap
router.put("/:id/reject", verifyJWT, rejectSwap); // Reject swap
router.put("/:id/complete", verifyJWT, checkProfileComplete, completeSwap); // Mark swap as completed

module.exports = router;
