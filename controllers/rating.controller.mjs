import asyncHandler from 'express-async-handler';

import Product from '../models/product.model.mjs';
import User from '../models/user.model.mjs';

/**
 * @route   POST /api/v1/ratings/:targetType/:targetId
 * @desc    Add or update a rating for a vet, shelter, or product
 * @access  Private (Owner only)
 */
export const addRating = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.params; // "user" or "product"
  const { rating, comment } = req.body;
  const userId = req.user._id; // logged-in owner

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: "Rating must be between 1 and 5",
    });
  }

  let targetDoc;

  if (targetType === "user") {
    // Ensure we only allow vets & shelters to be rated (not admins/owners)
    targetDoc = await User.findById(targetId);
    if (!targetDoc) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (!["vet", "shelter"].includes(targetDoc.role)) {
      return res.status(403).json({
        success: false,
        message: "Only vets or shelters can receive ratings",
      });
    }
  } else if (targetType === "product") {
    targetDoc = await Product.findById(targetId);
    if (!targetDoc) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid targetType, must be 'user' or 'product'",
    });
  }

  // Check if user already rated
  const existingRating = targetDoc.ratings.find(
    (r) => r.by.toString() === userId.toString()
  );

  if (existingRating) {
    // Update existing rating
    existingRating.rating = rating;
    existingRating.comment = comment || existingRating.comment;
  } else {
    // Add new rating
    targetDoc.ratings.push({ by: userId, rating, comment });
  }

  await targetDoc.save();

  res.status(200).json({
    success: true,
    message: `${
      targetType === "user" ? "User" : "Product"
    } rating added or updated successfully`,
    data: targetDoc,
  });
});

/**
 * @route   GET /api/v1/ratings/:targetType/:targetId/average
 * @desc    Get average rating and total number of ratings for a vet, shelter, or product
 * @access  Public
 */
export const getAverageRating = asyncHandler(async (req, res) => {
  const { targetId, targetType } = req.params;

  let targetDoc;

  if (targetType === "user") {
    targetDoc = await User.findById(targetId);
  } else if (targetType === "product") {
    targetDoc = await Product.findById(targetId);
  } else {
    return res.status(400).json({
      success: false,
      message: "Invalid targetType, must be 'user' or 'product'",
    });
  }

  if (!targetDoc) {
    return res.status(404).json({ success: false, message: "Not found" });
  }

  const total = targetDoc.ratings.reduce((sum, r) => sum + r.rating, 0);
  const avg = targetDoc.ratings.length ? total / targetDoc.ratings.length : 0;

  res.status(200).json({
    success: true,
    message: "Average rating retrieved successfully",
    average: avg.toFixed(1),
    count: targetDoc.ratings.length,
  });
});
