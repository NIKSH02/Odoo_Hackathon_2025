const router = require("express").Router();
const {
  redeemItem,
  getPointsHistory,
} = require("../controllers/points.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const checkProfileComplete = require("../middlewares/profileComplete.middleware");

// All points routes are protected
router.post("/redeem", verifyJWT, checkProfileComplete, redeemItem); // Redeem item via points
router.get("/history", verifyJWT, getPointsHistory); // User's point transactions

module.exports = router;
