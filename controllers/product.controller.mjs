import asyncHandler from 'express-async-handler';

import Product from '../models/product.model.mjs';
import { uploadFileOnCloudinary } from '../utils/cloudinary.mjs';

/**
 * @route   GET /api/v1/products
 * @desc    Get all products (with optional filters in controller if needed)
 * @access  Public
 */
const getAllProducts = asyncHandler(async (request, response) => {
  const products = await Product.find().sort({ createdAt:-1 });
  response.status(200).json({
    message: "Products retrieved successfully.",
    success: true,
    data: products,
  });
});

/**
 * @route   POST /api/v1/products
 * @desc    Add a new product
 * @access  Private (Admin and shelter)
 */
const addProduct = asyncHandler(async (request, response) => {
  const { name, category, price, description, image, ratings } = request.body;
  console.log(request.file)
  if (!name || !category || !price || !description) {
    return response.status(400).json({
      message: "Input all fields",
      success: false,
    });
  }

  const productExists = await Product.findOne({ name });
  if (productExists) {
    return response.status(400).json({
      message: "Product already exists",
      success: false,
    });
  }
  const uploadedOnCloudinary = await uploadFileOnCloudinary(request.file.path);
  console.log(uploadedOnCloudinary.url);

  const newProduct = await Product.create({
    name,
    category,
    price,
    description,
    image: uploadedOnCloudinary.url,
  });

  response.status(201).json({
    message: "New product added.",
    success: true,
    product: newProduct,
  });
});

/**
 * @route   PUT /api/v1/products/:id
 * @desc    Update a product by ID
 * @access  Private (Admin and shelter)
 */
const updateProduct = asyncHandler(async (request, response) => {
  const productId = request.params.id;
  const { name, category, price, description, image } = request.body;

  const product = await Product.findById(productId);

  if (!product) {
    return response.status(200).json({
      message: "Product not found.",
      success: false,
    });
  }

  const allowedCategories = ["food", "grooming", "toys", "accessories"];
  if (category && !allowedCategories.includes(category)) {
    return res.status(400).json({ message: "Invalid category" });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { name, category, price, description, image },
    { new: true }
  );

  response.status(200).json({
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

/**
 * @route   DELETE /api/v1/products/:id
 * @desc    Delete a product by ID
 * @access  Private (Admin and shelter)
 */
const deleteProduct = asyncHandler(async (request, response) => {
  const productId = request.params.id;
  const product = await Product.findById(productId);

  if (!product) {
    return response.status(200).json({
      message: "Product not found.",
      success: false,
    });
  }

  await Product.findByIdAndDelete(productId);
  response.status(200).json({
    message: "Product has been deleted successfully.",
    success: true,
  });
});

export { addProduct, deleteProduct, getAllProducts, updateProduct };
