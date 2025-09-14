import asyncHandler from 'express-async-handler';

import CareArticle from '../models/careArticle.model.mjs';

/**
 * @route   POST /api/v1/care-articles
 * @desc    Create a new care article (Admin only)
 * @access  Private (Admin)
 */
export const createArticle = asyncHandler(async (req, res) => {
  const { title, category, content, type } = req.body;

  if (!title || !category || !content) {
    return res.status(400).json({ message: "Title, category and content are required", success: false });
  }

  const article = await CareArticle.create({ title, category, content, type });

  res.status(201).json({
    message: "Care article created successfully",
    success: true,
    data: article,
  });
});

/**
 * @route   GET /api/v1/care-articles
 * @desc    Get all care articles (filter by category/type optional)
 * @access  Public
 */
export const getArticles = asyncHandler(async (req, res) => {
  const { category, type } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (type) filter.type = type;

  const articles = await CareArticle.find(filter);

  res.status(200).json({
    message: "Care articles retrieved successfully",
    success: true,
    data: articles,
  });
});

/**
 * @route   GET /api/v1/care-articles/:id
 * @desc    Get single care article by ID
 * @access  Public
 */
export const getArticleById = asyncHandler(async (req, res) => {
  const article = await CareArticle.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article not found", success: false });
  }

  res.status(200).json({
    message: "Care article retrieved successfully",
    success: true,
    data: article,
  });
});

/**
 * @route   PUT /api/v1/care-articles/:id
 * @desc    Update a care article (Admin only)
 * @access  Private (Admin)
 */
export const updateArticle = asyncHandler(async (req, res) => {
  const updates = req.body;

  const article = await CareArticle.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!article) {
    return res.status(404).json({ message: "Article not found", success: false });
  }

  res.status(200).json({
    message: "Care article updated successfully",
    success: true,
    data: article,
  });
});

/**
 * @route   DELETE /api/v1/care-articles/:id
 * @desc    Delete a care article (Admin only)
 * @access  Private (Admin)
 */
export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await CareArticle.findByIdAndDelete(req.params.id);

  if (!article) {
    return res.status(404).json({ message: "Article not found", success: false });
  }

  res.status(200).json({
    message: "Care article deleted successfully",
    success: true,
  });
});
