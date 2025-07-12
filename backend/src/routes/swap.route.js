const router = require("express").Router();
const {
  requestSwap,
  getUserSwaps,
  acceptSwap,
  rejectSwap,
  completeSwap,
} = require("../controllers/swap.controller");
const verifyJWT = require("../middlewares/auth.middleware");

// All swap routes are protected
router.post("/request", verifyJWT, requestSwap); // Request swap
router.get("/", verifyJWT, getUserSwaps); // List user swaps
router.put("/:id/accept", verifyJWT, acceptSwap); // Accept swap
router.put("/:id/reject", verifyJWT, rejectSwap); // Reject swap
router.put("/:id/complete", verifyJWT, completeSwap); // Mark swap as completed

module.exports = router;
