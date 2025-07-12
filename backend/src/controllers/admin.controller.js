const Item = require("../models/Item.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asynchandler");

// Get items pending approval
const getPendingItems = asyncHandler(async (req, res) => {
  const pendingItems = await Item.find({ approved: false })
    .populate('listedBy', 'username email')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(200, pendingItems, "Pending items retrieved successfully")
  );
});

// Approve item
const approveItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await Item.findById(id);
  
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.approved) {
    throw new ApiError(400, "Item is already approved");
  }

  item.approved = true;
  await item.save();

  res.status(200).json(
    new ApiResponse(200, item, "Item approved successfully")
  );
});

// Reject item
const rejectItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  const item = await Item.findById(id);
  
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  // You could add a rejection reason field to the Item model if needed
  await Item.findByIdAndDelete(id);

  res.status(200).json(
    new ApiResponse(200, { reason }, "Item rejected and removed successfully")
  );
});

// Remove item (admin action)
const removeItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await Item.findById(id);
  
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  await Item.findByIdAndDelete(id);

  res.status(200).json(
    new ApiResponse(200, {}, "Item removed successfully")
  );
});

module.exports = {
  getPendingItems,
  approveItem,
  rejectItem,
  removeItem,
};
