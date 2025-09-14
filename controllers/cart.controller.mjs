import asyncHandler from 'express-async-handler';

import Cart from '../models/cart.model.mjs';

/**
 * @route   POST /api/v1/cart
 * @desc    Add a product to the cart
 * @access  Private (Owner)
 */
export const addToCart = asyncHandler(async (req, res) => {
  const { product, quantity } = req.body;

  if (!product) {
    return res.status(400).json({ message: "Product ID is required", success: false });
  }

  let cart = await Cart.findOne({ owner: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      owner: req.user._id,
      items: [{ product, quantity: quantity || 1 }],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === product
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ product, quantity: quantity || 1 });
    }
    await cart.save();
  }

  res.status(200).json({
    message: "Product added to cart",
    success: true,
    data: cart,
  });
});

/**
 * @route   GET /api/v1/cart
 * @desc    Get logged-in user's cart
 * @access  Private (Owner)
 */
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ owner: req.user._id }).populate("items.product");

  if (!cart) {
    return res.status(200).json({
      message: "Cart is empty",
      success: true,
      data: { items: [] },
    });
  }

  res.status(200).json({
    message: "Cart retrieved successfully",
    success: true,
    data: cart,
  });
});

/**
 * @route   PUT /api/v1/cart
 * @desc    Update quantity of a product in cart
 * @access  Private (Owner)
 */
export const updateCartItem = asyncHandler(async (req, res) => {
  const { product, quantity } = req.body;

  if (!product || quantity === undefined) {
    return res.status(400).json({ message: "Product ID and quantity required", success: false });
  }

  const cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found", success: false });
  }

  const item = cart.items.find((i) => i.product.toString() === product);
  if (!item) {
    return res.status(404).json({ message: "Item not found in cart", success: false });
  }

  item.quantity = quantity;
  await cart.save();

  res.status(200).json({
    message: "Cart item updated",
    success: true,
    data: cart,
  });
});

/**
 * @route   DELETE /api/v1/cart/item
 * @desc    Remove a product from the cart
 * @access  Private (Owner)
 */
export const removeFromCart = asyncHandler(async (req, res) => {
  const { product } = req.body;

  const cart = await Cart.findOne({ owner: req.user._id });
  if (!cart) {
    return res.status(404).json({ message: "Cart not found", success: false });
  }

  cart.items = cart.items.filter((i) => i.product.toString() !== product);
  await cart.save();

  res.status(200).json({
    message: "Item removed from cart",
    success: true,
    data: cart,
  });
});

/**
 * @route   DELETE /api/v1/cart/clear
 * @desc    Clear the entire cart
 * @access  Private (Owner)
 */
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOneAndUpdate(
    { owner: req.user._id },
    { items: [] },
    { new: true }
  );

  res.status(200).json({
    message: "Cart cleared successfully",
    success: true,
    data: cart,
  });
});
