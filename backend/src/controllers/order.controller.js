const Order = require("../models/Order.model");
const Item = require("../models/Item.model");
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asynchandler");

// Get user's orders
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    $or: [
      { requester: req.user._id },
      { responder: req.user._id }
    ]
  })
  .populate('itemOffered', 'title images category pointsCost')
  .populate('itemRequested', 'title images category pointsCost')
  .populate('item', 'title images category pointsCost')
  .populate('requester', 'username email')
  .populate('responder', 'username email')
  .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, orders, "Orders retrieved successfully")
  );
});

// Get order by ID
const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const order = await Order.findById(id)
    .populate('itemOffered', 'title images category pointsCost listedBy')
    .populate('itemRequested', 'title images category pointsCost listedBy')
    .populate('item', 'title images category pointsCost listedBy')
    .populate('requester', 'username email')
    .populate('responder', 'username email')
    .populate('completedBy', 'username email');

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is part of this order
  if (order.requester._id.toString() !== req.user._id.toString() && 
      (order.responder && order.responder._id.toString() !== req.user._id.toString())) {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  res.status(200).json(
    new ApiResponse(200, order, "Order retrieved successfully")
  );
});

// Mark order as complete with code verification
const completeOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { requesterCode, responderCode } = req.body;

  const order = await Order.findById(id);
  
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is part of this order
  if (order.requester.toString() !== req.user._id.toString() && 
      (order.responder && order.responder.toString() !== req.user._id.toString())) {
    throw new ApiError(403, "You are not authorized to complete this order");
  }

  if (order.status !== 'accepted') {
    throw new ApiError(400, "Order must be in accepted status to complete");
  }

  // Verify codes based on order type
  if (order.orderType === 'swap') {
    if (!requesterCode || !responderCode) {
      throw new ApiError(400, "Both requester and responder codes are required for swap completion");
    }
    
    if (requesterCode !== order.requesterCode || responderCode !== order.responderCode) {
      throw new ApiError(400, "Invalid verification codes. Both codes must match.");
    }
  } else if (order.orderType === 'pointsRedemption') {
    if (!requesterCode) {
      throw new ApiError(400, "Requester code is required for redemption completion");
    }
    
    if (requesterCode !== order.requesterCode) {
      throw new ApiError(400, "Invalid verification code.");
    }
  }

  order.status = 'completed';
  order.completedAt = new Date();
  order.completedBy = req.user._id;
  await order.save();

  // Award points for completed orders
  if (order.orderType === 'swap') {
    // Award 25 points to both users for successful swap
    await User.findByIdAndUpdate(order.requester, { $inc: { points: 25 } });
    await User.findByIdAndUpdate(order.responder, { $inc: { points: 25 } });

    // Update item statuses to swapped
    await Item.findByIdAndUpdate(order.itemOffered, { status: 'swapped' });
    await Item.findByIdAndUpdate(order.itemRequested, { status: 'swapped' });
  } else if (order.orderType === 'pointsRedemption') {
    // Award 25 points to the item lister
    const item = await Item.findById(order.item);
    await User.findByIdAndUpdate(item.listedBy, { $inc: { points: 25 } });

    // Update item status to swapped
    await Item.findByIdAndUpdate(order.item, { status: 'swapped' });
  }

  res.status(200).json(
    new ApiResponse(200, order, "Order completed successfully and points awarded")
  );
});

// Cancel order
const cancelOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const order = await Order.findById(id);
  
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is part of this order
  if (order.requester.toString() !== req.user._id.toString() && 
      (order.responder && order.responder.toString() !== req.user._id.toString())) {
    throw new ApiError(403, "You are not authorized to cancel this order");
  }

  if (order.status !== 'accepted') {
    throw new ApiError(400, "Only accepted orders can be cancelled");
  }

  order.status = 'cancelled';
  order.cancelledAt = new Date();
  order.cancellationReason = reason;
  await order.save();

  // Refund points for point redemption orders
  if (order.orderType === 'pointsRedemption') {
    await User.findByIdAndUpdate(order.requester, { $inc: { points: order.pointsUsed } });
  }

  // Update item statuses back to available
  if (order.orderType === 'swap') {
    await Item.findByIdAndUpdate(order.itemOffered, { status: 'available' });
    await Item.findByIdAndUpdate(order.itemRequested, { status: 'available' });
  } else if (order.orderType === 'pointsRedemption') {
    await Item.findByIdAndUpdate(order.item, { status: 'available' });
  }

  res.status(200).json(
    new ApiResponse(200, order, "Order cancelled successfully")
  );
});

// Get order by order code
const getOrderByCode = asyncHandler(async (req, res) => {
  const { orderCode } = req.params;
  
  const order = await Order.findOne({ orderCode })
    .populate('itemOffered', 'title images category pointsCost')
    .populate('itemRequested', 'title images category pointsCost')
    .populate('item', 'title images category pointsCost')
    .populate('requester', 'username email')
    .populate('responder', 'username email');

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is part of this order
  if (order.requester._id.toString() !== req.user._id.toString() && 
      (order.responder && order.responder._id.toString() !== req.user._id.toString())) {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  res.status(200).json(
    new ApiResponse(200, order, "Order retrieved successfully")
  );
});

// Get user's verification codes for an order
const getUserVerificationCodes = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const order = await Order.findById(id);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Check if user is part of this order
  if (order.requester.toString() !== req.user._id.toString() && 
      (order.responder && order.responder.toString() !== req.user._id.toString())) {
    throw new ApiError(403, "You are not authorized to view this order");
  }

  if (order.status !== 'accepted') {
    throw new ApiError(400, "Order must be in accepted status to view codes");
  }

  let userCodes = {};

  // Return codes based on user role and order type
  if (order.orderType === 'swap') {
    if (order.requester.toString() === req.user._id.toString()) {
      userCodes = {
        myCode: order.requesterCode,
        role: 'requester',
        needsPartnerCode: true,
        orderType: 'swap'
      };
    } else if (order.responder.toString() === req.user._id.toString()) {
      userCodes = {
        myCode: order.responderCode,
        role: 'responder',
        needsPartnerCode: true,
        orderType: 'swap'
      };
    }
  } else if (order.orderType === 'pointsRedemption') {
    if (order.requester.toString() === req.user._id.toString()) {
      userCodes = {
        myCode: order.requesterCode,
        role: 'requester',
        needsPartnerCode: false,
        orderType: 'pointsRedemption'
      };
    }
  }

  res.status(200).json(
    new ApiResponse(200, userCodes, "Verification codes retrieved successfully")
  );
});

module.exports = {
  getUserOrders,
  getOrderById,
  completeOrder,
  cancelOrder,
  getOrderByCode,
  getUserVerificationCodes,
};
