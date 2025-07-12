const Swap = require("../models/Swap.model");
const Order = require("../models/Order.model");
const Item = require("../models/Item.model");
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asynchandler");

// Helper function to check exchange limits between users
const checkExchangeLimit = async (user1Id, user2Id) => {
  const twoWeeksAgo = new Date();
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

  // Find completed swap orders between these two users in the last 2 weeks
  const recentSwaps = await Order.find({
    orderType: 'swap',
    status: 'completed',
    completedAt: { $gte: twoWeeksAgo },
    $or: [
      { requester: user1Id, responder: user2Id },
      { requester: user2Id, responder: user1Id }
    ]
  });

  return recentSwaps.length < 3; // Allow up to 3 swaps every 2 weeks
};

// Request a swap
const requestSwap = asyncHandler(async (req, res) => {
  const { itemOffered, itemRequested } = req.body;

  if (!itemOffered || !itemRequested) {
    throw new ApiError(400, "Both items are required for swap");
  }

  const offeredItem = await Item.findById(itemOffered);
  const requestedItem = await Item.findById(itemRequested);

  if (!offeredItem || !requestedItem) {
    throw new ApiError(404, "One or both items not found");
  }

  if (offeredItem.listedBy.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only offer your own items");
  }

  if (requestedItem.listedBy.toString() === req.user._id.toString()) {
    throw new ApiError(400, "You cannot request your own item");
  }

  if (offeredItem.status !== 'available' || requestedItem.status !== 'available') {
    throw new ApiError(400, "Both items must be available for swap");
  }

  // Check exchange limits between users
  const canExchange = await checkExchangeLimit(req.user._id, requestedItem.listedBy);
  if (!canExchange) {
    throw new ApiError(400, "Exchange limit exceeded. You can only request/complete 3 swaps with the same user every 2 weeks.");
  }

  const swap = await Swap.create({
    itemOffered,
    itemRequested,
    requester: req.user._id,
    responder: requestedItem.listedBy,
  });

  // Update item statuses to pending
  await Item.findByIdAndUpdate(itemOffered, { status: 'pending' });
  await Item.findByIdAndUpdate(itemRequested, { status: 'pending' });

  // Add swap to both users
  await User.findByIdAndUpdate(req.user._id, { $push: { swaps: swap._id } });
  await User.findByIdAndUpdate(requestedItem.listedBy, { $push: { swaps: swap._id } });

  res.status(201).json(
    new ApiResponse(201, swap, "Swap request created successfully")
  );
});

// Get user's swaps
const getUserSwaps = asyncHandler(async (req, res) => {
  const swaps = await Swap.find({
    $or: [
      { requester: req.user._id },
      { responder: req.user._id }
    ]
  })
  .populate('itemOffered', 'title images category')
  .populate('itemRequested', 'title images category')
  .populate('requester', 'username email')
  .populate('responder', 'username email')
  .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, swaps, "Swaps retrieved successfully")
  );
});

// Accept swap
const acceptSwap = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const swap = await Swap.findById(id);
  
  if (!swap) {
    throw new ApiError(404, "Swap not found");
  }

  if (swap.responder.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the responder can accept this swap");
  }

  if (swap.status !== 'pending') {
    throw new ApiError(400, "Swap is not in pending status");
  }

  // Check exchange limits between users before creating order
  const canExchange = await checkExchangeLimit(swap.requester, swap.responder);
  if (!canExchange) {
    throw new ApiError(400, "Exchange limit exceeded. You can only complete 3 swaps with the same user every 2 weeks.");
  }

  swap.status = 'accepted';
  await swap.save();

  // Create an order for the accepted swap
  const order = await Order.create({
    orderType: 'swap',
    itemOffered: swap.itemOffered,
    itemRequested: swap.itemRequested,
    requester: swap.requester,
    responder: swap.responder,
    status: 'accepted',
  });

  // Add order to both users
  await User.findByIdAndUpdate(swap.requester, { $push: { orders: order._id } });
  await User.findByIdAndUpdate(swap.responder, { $push: { orders: order._id } });

  res.status(200).json(
    new ApiResponse(200, { swap, order }, "Swap accepted and order created successfully")
  );
});

// Reject swap
const rejectSwap = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const swap = await Swap.findById(id);
  
  if (!swap) {
    throw new ApiError(404, "Swap not found");
  }

  if (swap.responder.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the responder can reject this swap");
  }

  if (swap.status !== 'pending') {
    throw new ApiError(400, "Swap is not in pending status");
  }

  swap.status = 'rejected';
  await swap.save();

  // Update item statuses back to available
  await Item.findByIdAndUpdate(swap.itemOffered, { status: 'available' });
  await Item.findByIdAndUpdate(swap.itemRequested, { status: 'available' });

  res.status(200).json(
    new ApiResponse(200, swap, "Swap rejected successfully")
  );
});

// Complete swap
const completeSwap = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const swap = await Swap.findById(id);
  
  if (!swap) {
    throw new ApiError(404, "Swap not found");
  }

  if (swap.requester.toString() !== req.user._id.toString() && 
      swap.responder.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You are not part of this swap");
  }

  if (swap.status !== 'accepted') {
    throw new ApiError(400, "Swap must be accepted before completion");
  }

  swap.status = 'completed';
  swap.completedAt = new Date();
  await swap.save();

  res.status(200).json(
    new ApiResponse(200, swap, "Swap completed successfully. Please use the order system for tracking and points.")
  );
});

module.exports = {
  requestSwap,
  getUserSwaps,
  acceptSwap,
  rejectSwap,
  completeSwap,
};
