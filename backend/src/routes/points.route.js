const router = require("express").Router();
const {
  redeemItem,
  getPointsHistory,
} = require("../controllers/points.controller");
const verifyJWT = require("../middlewares/auth.middleware");

// All points routes are protected
router.post("/redeem", verifyJWT, redeemItem); // Redeem item via points
router.get("/history", verifyJWT, getPointsHistory); // User's point transactions

module.exports = router;
