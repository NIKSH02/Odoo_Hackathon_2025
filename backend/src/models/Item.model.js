const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    category: {
      type: String,
      required: true,
      enum: ['Men', 'Women', 'Kids'],
    },
    subCategory: {
      type: String,
      required: true,
      enum: ['casual', 'formal', 'party', 'sports', 'wedding', 'other'],
    },
    size: {
      type: String,
      required: true,
    },
    condition: {
      type: String,
      required: true,
      enum: ['new', 'like-new', 'good', 'fair', 'worn'],
    },
    pointsCost: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['available', 'pending', 'swapped'],
      default: 'available',
    },
    listedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    approved: {
      type: Boolean,
      default: true, // Auto-approve items for now
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
