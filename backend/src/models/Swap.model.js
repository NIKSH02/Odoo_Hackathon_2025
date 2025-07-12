const mongoose = require("mongoose");

const SwapSchema = new mongoose.Schema(
  {
    itemOffered: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    itemRequested: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    responder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed'],
      default: 'pending',
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swap", SwapSchema);
