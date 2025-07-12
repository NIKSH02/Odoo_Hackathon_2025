const Item = require("../models/Item.model");
const User = require("../models/User.model");
const ApiError = require("../utils/apiError");
const ApiResponse = require("../utils/apiResponse");
const asyncHandler = require("../utils/asynchandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");

// Get all items with filtering
const getAllItems = asyncHandler(async (req, res) => {
  const { category, subCategory, size, condition, status } = req.query;
  
  let filter = {}; // Remove approved filter for now
  
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (size) filter.size = size;
  if (condition) filter.condition = condition;
  if (status) filter.status = status;

  console.log('getAllItems filter:', filter);

  const items = await Item.find(filter)
    .populate('listedBy', 'username email')
    .sort({ createdAt: -1 });

  console.log('Found items:', items.length);

  res.status(200).json(
    new ApiResponse(200, "Items retrieved successfully", items)
  );
});

// Get current user's items
const getUserItems = asyncHandler(async (req, res) => {
  const { category, subCategory, size, condition, status } = req.query;
  
  console.log('getUserItems called for user:', req.user._id);
  
  let filter = { listedBy: req.user._id };
  
  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;
  if (size) filter.size = size;
  if (condition) filter.condition = condition;
  if (status) filter.status = status;

  console.log('Filter for getUserItems:', filter);

  const items = await Item.find(filter)
    .populate('listedBy', 'username email')
    .sort({ createdAt: -1 });

  console.log('Found user items:', items.length);

  res.status(200).json(
    new ApiResponse(200, items, "User items retrieved successfully")
  );
});

// Get item by ID
const getItemById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const item = await Item.findById(id)
    .populate('listedBy', 'username email points');

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  res.status(200).json(
    new ApiResponse(200, "Item retrieved successfully", item)
  );
});

// Create new item
const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, subCategory, size, condition, pointsCost } = req.body;
  
  if (!title || !description || !category || !subCategory || !size || !condition || pointsCost === undefined) {
    throw new ApiError(400, "All fields including points cost are required");
  }

  if (pointsCost < 0) {
    throw new ApiError(400, "Points cost cannot be negative");
  }

  if (!req.files || !req.files.images) {
    throw new ApiError(400, "At least one image is required");
  }

  // Handle single or multiple files (express-fileupload format)
  const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

  // Upload images to cloudinary directly from buffer
  const imageUrls = [];
  for (const file of files) {
    const result = await uploadOnCloudinary(file.data, file.name);
    if (result) {
      imageUrls.push(result.secure_url);
    }
  }

  if (imageUrls.length === 0) {
    throw new ApiError(500, "Failed to upload images");
  }

  const item = await Item.create({
    title,
    description,
    images: imageUrls,
    category,
    subCategory,
    size,
    condition,
    pointsCost,
    listedBy: req.user._id,
  });

  // Add item to user's listedItems
  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { listedItems: item._id } }
  );

  res.status(201).json(
    new ApiResponse(201, "Item created successfully", item)
  );
});

// Update item
const updateItem = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, category, subCategory, size, condition, pointsCost } = req.body;

  const item = await Item.findById(id);
  
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  // Check if user is the lister or admin
  if (item.listedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, "You can only edit your own items");
  }

  // Handle new images if provided
  let imageUrls = item.images;
  if (req.files && req.files.length > 0) {
    imageUrls = [];
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.buffer, file.originalname);
      if (result) {
        imageUrls.push(result.secure_url);
      }
    }
  }

  const updatedItem = await Item.findByIdAndUpdate(
    id,
    {
      title: title || item.title,
      description: description || item.description,
      category: category || item.category,
      subCategory: subCategory || item.subCategory,
      size: size || item.size,
      condition: condition || item.condition,
      pointsCost: pointsCost !== undefined ? pointsCost : item.pointsCost,
      images: imageUrls,
    },
    { new: true }
  );

  res.status(200).json(
    new ApiResponse(200, updatedItem, "Item updated successfully")
  );
});

// Delete item
const deleteItem = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await Item.findById(id);
  
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  // Check if user is the lister or admin
  if (item.listedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, "You can only delete your own items");
  }

  await Item.findByIdAndDelete(id);

  // Remove item from user's listedItems
  await User.findByIdAndUpdate(
    item.listedBy,
    { $pull: { listedItems: id } }
  );

  res.status(200).json(
    new ApiResponse(200, {}, "Item deleted successfully")
  );
});

module.exports = {
  getAllItems,
  getUserItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
