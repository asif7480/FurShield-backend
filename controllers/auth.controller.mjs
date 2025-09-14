import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import asyncHandler from 'express-async-handler';

import User from '../models/user.model.mjs';
import { uploadFileOnCloudinary } from '../utils/cloudinary.mjs';
import { generateToken } from '../utils/generateToken.mjs';

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const {
    name,
    contactNumber,
    email,
    address,
    password,
    profileImg,
    role,
    specialization,
    experience,
    availableTimeSlots,
    shelterName,
    contactPerson,
  } = req.body;

  // Determine actual name to use (shelterName for shelters)
  const actualName = role === "shelter" ? shelterName : name;

  // Validate common required fields
  if (!actualName || !contactNumber || !email || !address || !password || !role) {
    return res.status(400).json({
      message: "All required fields must be filled.",
      success: false,
    });
  }

  // Validate role explicitly
  if (!["owner", "vet", "shelter", "admin"].includes(role)) {
    return res.status(400).json({
      message: "Invalid role specified.",
      success: false,
    });
  }

  // Role-specific validations
  if (role === "vet" && (!specialization || !experience)) {
    return res.status(400).json({
      message: "Vet must provide specialization and experience.",
      success: false,
    });
  }

  if (role === "shelter" && (!shelterName || !contactPerson)) {
    return res.status(400).json({
      message: "Shelter must provide shelter name and contact person.",
      success: false,
    });
  }

  // Check for existing user
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    return res.status(400).json({
      message: "Email already registered.",
      success: false,
    });
  }

  // Hash password
  const hashPassword = await bcrypt.hash(password, 10);

  // Upload profile image to Cloudinary if provided
  let uploadedUrl = null;
  if (req.file) {
    const uploadedOnCloudinary = await uploadFileOnCloudinary(req.file.path);
    uploadedUrl = uploadedOnCloudinary?.url || null;
  }

  // Prepare user data
  const userData = {
    name: actualName,
    contactNumber,
    email: email.toLowerCase(),
    address,
    password: hashPassword,
    profileImg: uploadedUrl,
    role,
  };

  if (role === "vet") {
    userData.specialization = specialization;
    userData.experience = experience;
    userData.availableTimeSlots = availableTimeSlots || [];
  }

  if (role === "shelter") {
    userData.shelterName = shelterName;
    userData.contactPerson = contactPerson;
  }

  // Create user
  const newUser = await User.create(userData);

  // Response
  return res.status(201).json({
    message: "User registered successfully",
    success: true,
    user: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
  });
});


/**
 * @route   POST /auth/login
 * @desc    Login user and return token
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
      success: false,
    });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({
      message: "User not registered.",
      success: false,
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid password",
      success: false,
    });
  }

  // Generate token
  const token = generateToken(user._id);

  // Save token in cookie
  res.cookie("token", token, {
    httpOnly: true, // JS can't access
    secure: process.env.NODE_ENV === "production", // only HTTPS in prod
    sameSite: "strict",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  return res.status(200).json({
    message: "Login successful",
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @route   POST /auth/forgotPassword
 * @desc    Request a password reset token
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    return res.status(404).json({ message: "User not found", success: false });
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();

  return res.status(200).json({
    message: "Password reset token generated",
    success: true,
    resetToken: token,
  });
});

/**
 * @route   POST /auth/resetPassword/:token
 * @desc    Reset password using token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      message: "Invalid or expired token",
      success: false,
    });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  return res.status(200).json({
    message: "Password reset successful",
    success: true,
  });
});

/**
 * @route   GET /auth/profile
 * @desc    Get user profile
 * @access  Private (Authenticated users only)
 */
export const profile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "User profile retrieved",
    success: true,
    user,
  });
});

/**
 * @route   PUT /auth/update-profile
 * @desc    Update user profile
 * @access  Private (Authenticated users only)
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = [
    "name",
    "contactNumber",
    "address",
    "specialization",
    "experience",
    "availableTimeSlots",
    "shelterName",
    "contactPerson",
  ];

  const updates = {};
  allowedUpdates.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    return res.status(404).json({
      message: "User not found",
      success: false,
    });
  }

  return res.status(200).json({
    message: "Profile updated successfully",
    success: true,
    user: updatedUser,
  });
});

/**
 * @route   POST /auth/logout
 * @desc    log out user and cancel token
 * @access  Public
 */
export const logout = asyncHandler(async (request, response) => {
  response.clearCookie("token", {
    httpOnly: true,
    secure: false,
    // secure: true, // for production
    sameSite: "lax",
    // sameSite: "none" // for production
  });

  response.status(200).json({
    message: "logout successfully.",
    success: true,
  });
});