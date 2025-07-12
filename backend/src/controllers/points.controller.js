const PointRedemption = require("../models/PointRedemption.model");
const Order = require("../models/Order.model");
const Item = require("../models/Item.model");
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asynchandler");

// Redeem item with points
const redeemItem = asyncHandler(async (req, res) => {
  const { itemId } = req.body;

  if (!itemId) {
    throw new ApiError(400, "Item ID is required");
  }

  const item = await Item.findById(itemId);
  
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.status !== 'available') {
    throw new ApiError(400, "Item is not available for redemption");
  }

  if (item.listedBy.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot redeem your own item");
  }

  const pointsRequired = item.pointsCost;

  if (req.user.points < pointsRequired) {
    throw new ApiError(400, `Insufficient points. Required: ${pointsRequired}, Available: ${req.user.points}`);
  }

  // Create point redemption record
  const redemption = await PointRedemption.create({
    user: req.user._id,
    item: itemId,
    pointsUsed: pointsRequired,
    status: 'completed',
  });

  // Create an order for the point redemption
  const order = await Order.create({
    orderType: 'pointsRedemption',
    item: itemId,
    requester: req.user._id,
    pointsUsed: pointsRequired,
    status: 'accepted',
  });

  // Deduct points from user
  await User.findByIdAndUpdate(req.user._id, { $inc: { points: -pointsRequired } });

  // Update item status to pending
  await Item.findByIdAndUpdate(itemId, { status: 'pending' });

  // Add order to user
  await User.findByIdAndUpdate(req.user._id, { $push: { orders: order._id } });

  res.status(201).json(
    new ApiResponse(201, { redemption, order }, "Item redemption successful and order created")
  );
});

// Get user's point transaction history
const getPointsHistory = asyncHandler(async (req, res) => {
  const redemptions = await PointRedemption.find({ user: req.user._id })
    .populate('item', 'title images category')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, redemptions, "Points history retrieved successfully")
  );
});

module.exports = {
  redeemItem,
  getPointsHistory,
};
