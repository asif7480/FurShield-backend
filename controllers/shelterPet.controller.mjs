import asyncHandler from 'express-async-handler';

import ShelterPet from '../models/shelterPet.model.mjs';
import { uploadFileOnCloudinary } from '../utils/cloudinary.mjs';

/**
 * @route   POST /api/v1/shelter-pets
 * @desc    Add a new pet to the shelter listings
 * @access  Private (Shelter)
 */
export const addShelterPet = asyncHandler(async (req, res) => {
  const { name, breed, age, healthStatus, images } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Pet name is required", success: false });
  }

// Upload multiple images to Cloudinary if provided
  let imageUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map((file) =>
      uploadFileOnCloudinary(file.path)
    );
    const uploadedResults = await Promise.all(uploadPromises);
    imageUrls = uploadedResults.map((result) => result.url);
  }

  const pet = await ShelterPet.create({
    shelter: req.user._id, // logged-in shelter user
    name,
    breed,
    age,
    healthStatus,
    images: imageUrls,
  });

  return res.status(201).json({
    message: "Shelter pet added successfully",
    success: true,
    data: pet,
  });
});

/**
 * @route   GET /api/v1/shelter-pets
 * @desc    Get all pets in the logged-in shelter
 * @access  Private (Shelter)
 */
export const getShelterPets = asyncHandler(async (req, res) => {
  const pets = await ShelterPet.find({ shelter: req.user._id }).sort({ createdAt:-1 });

  return res.status(200).json({
    message: "Shelter pets retrieved successfully",
    success: true,
    data: pets,
  });
});

/**
 * @route   GET /api/v1/shelter-pets/:id
 * @desc    Get details of a specific shelter pet
 * @access  Private (Shelter)
 */
export const getShelterPetById = asyncHandler(async (req, res) => {
  const pet = await ShelterPet.findOne({ _id: req.params.id, shelter: req.user._id });

  if (!pet) {
    return res.status(404).json({ message: "Pet not found", success: false });
  }

  return res.status(200).json({
    message: "Shelter pet retrieved successfully",
    success: true,
    data: pet,
  });
});

/**
 * @route   PUT /api/v1/shelter-pets/:id
 * @desc    Update shelter pet details
 * @access  Private (Shelter)
 */
export const updateShelterPet = asyncHandler(async (req, res) => {
  const updates = req.body;

  const pet = await ShelterPet.findOneAndUpdate(
    { _id: req.params.id, shelter: req.user._id },
    updates,
    { new: true, runValidators: true }
  );

  if (!pet) {
    return res.status(404).json({ message: "Pet not found", success: false });
  }

  return res.status(200).json({
    message: "Shelter pet updated successfully",
    success: true,
    data: pet,
  });
});

/**
 * @route   DELETE /api/v1/shelter-pets/:id
 * @desc    Delete a shelter pet from listings
 * @access  Private (Shelter)
 */
export const deleteShelterPet = asyncHandler(async (req, res) => {
  const pet = await ShelterPet.findOneAndDelete({ _id: req.params.id, shelter: req.user._id });

  if (!pet) {
    return res.status(404).json({ message: "Pet not found", success: false });
  }

  return res.status(200).json({
    message: "Shelter pet deleted successfully",
    success: true,
  });
});

/**
 * @route   POST /api/v1/shelter-pets/:id/care-log
 * @desc    Add a care log entry for a shelter pet
 * @access  Private (Shelter)
 */
export const addCareLog = asyncHandler(async (req, res) => {
  const { feeding, grooming, medical } = req.body;

  const pet = await ShelterPet.findOne({ _id: req.params.id, shelter: req.user._id });

  if (!pet) {
    return res.status(404).json({ message: "Pet not found", success: false });
  }

  pet.careLogs.push({
    date: new Date(),
    feeding,
    grooming,
    medical,
  });

  await pet.save();

  return res.status(200).json({
    message: "Care log added successfully",
    success: true,
    data: pet,
  });
});

/**
 * @route   PUT /api/v1/shelter-pets/:id/adoption-status
 * @desc    Update adoption status of a shelter pet
 * @access  Private (Shelter)
 */
export const updateAdoptionStatus = asyncHandler(async (req, res) => {
  const { adoptionStatus } = req.body;

  const pet = await ShelterPet.findOneAndUpdate(
    { _id: req.params.id, shelter: req.user._id },
    { adoptionStatus },
    { new: true, runValidators: true }
  );

  if (!pet) {
    return res.status(404).json({ message: "Pet not found", success: false });
  }

  return res.status(200).json({
    message: "Adoption status updated successfully",
    success: true,
    data: pet,
  });
});
