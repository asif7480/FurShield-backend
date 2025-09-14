import asyncHandler from "express-async-handler";

import Appointment from "../models/appointment.model.mjs";
import HealthRecord from "../models/healthRecord.model.mjs";
import Pet from "../models/pet.model.mjs";
import { uploadFileOnCloudinary } from "../utils/cloudinary.mjs";

/**
 * @route   POST /api/v1/pets
 * @desc    Create a new pet profile for the logged-in owner
 * @access  Private (Owner only)
 */
export const createPet = asyncHandler(async (req, res) => {
  const { name, species, breed, age, gender, medicalHistory, image } = req.body;

  if (!name || !species) {
    return res.status(400).json({
      message: "Name and species are required",
      success: false,
    });
  }

  // Upload multiple image to Cloudinary if provided
  // let imageUrls = [];
  // if (req.files && req.files.length > 0) {
  //   const uploadPromises = req.files.map((file) =>
  //     uploadFileOnCloudinary(file.path)
  //   );
  //   const uploadedResults = await Promise.all(uploadPromises);
  //   imageUrls = uploadedResults.map((result) => result.url);
  // }

  const uploadedOnCloudinary = await uploadFileOnCloudinary(req.file.path);
  console.log(uploadedOnCloudinary.url);

  const pet = await Pet.create({
    owner: req.user._id,
    name,
    species,
    breed,
    age,
    gender,
    medicalHistory,
    image: uploadedOnCloudinary.url,
  });

  return res.status(201).json({
    message: "Pet created successfully",
    success: true,
    data: pet,
  });
});

/**
 * @route   GET /api/v1/pets
 * @desc    Get all pets owned by the logged-in user
 * @access  Private (Owner only)
 */
export const getAllPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find().populate("owner");

  return res.status(200).json({
    message: "Pets retrieved successfully",
    success: true,
    data: pets,
  });
});

/**
 * @route   GET /api/v1/pets
 * @desc    Get all pets owned by the logged-in user
 * @access  Private (Owner only)
 */
export const getOwnerPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ owner: req.user._id }).populate("owner");

  return res.status(200).json({
    message: "Pets retrieved successfully",
    success: true,
    data: pets,
  });
});

/**
 * @route   GET /api/v1/pets/:id
 * @desc    Get a single pet by ID (must belong to logged-in owner)
 * @access  Private (Owner only)
 */
export const getPetById = asyncHandler(async (req, res) => {
  const pet = await Pet.findOne({ _id: req.params.id, owner: req.user._id });

  if (!pet) {
    return res.status(404).json({ message: "Pet not found", success: false });
  }

  return res.status(200).json({
    message: "Pet retrieved successfully",
    success: true,
    data: pet,
  });
});

/**
 * @route   PUT /api/v1/pets/:id
 * @desc    Update pet details (must belong to logged-in owner)
 * @access  Private (Owner only)
 */
export const updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(400).json({
      message: "Pet not found.",
      success: true,
    });
  }

  const updatedPet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  return res.status(200).json({
    message: "Pet updated successfully.",
    success: false,
    pet: updatedPet,
  });

  // const updates = req.body;

  // const pet = await Pet.findOneAndUpdate(
  //   { _id: req.params.id, owner: req.user._id },
  //   updates,
  //   { new: true, runValidators: true }
  // );

  // if (!pet) {
  //   return res.status(404).json({ message: "Pet not found", success: false });
  // }

  // return res.status(200).json({
  //   message: "Pet updated successfully",
  //   success: true,
  //   data: pet,
  // });
});

/**
 * @route   DELETE /api/v1/pets/:id
 * @desc    Delete a pet (must belong to logged-in owner)
 * @access  Private (Owner only)
 */
export const deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet) {
    return res.status(400).json({
      message: "Pet not found.",
      success: false,
    });
  }

  await Pet.findByIdAndDelete(req.params.id);
  return res.status(200).json({
    message: "Pet deleted successfully",
    success: true,
  });

  // const pet = await Pet.findOneAndDelete({
  //   _id: req.params.id,
  //   owner: req.user._id,
  // });

  // if (!pet) {
  //   return res.status(404).json({ message: "Pet not found", success: false });
  // }

  // return res.status(200).json({
  //   message: "Pet deleted successfully",
  //   success: true,
  // });
});

/**
 * @route   GET /api/v1/pets/:petId/records
 * @desc    Get pet medical history (only if vet has appointment with pet)
 * @access  Private (Vet only)
 */
export const getPetRecordsForVet = asyncHandler(async (req, res) => {
  const { petId } = req.params;

  // Check if vet has an appointment with this pet
  const appointment = await Appointment.findOne({
    pet: petId,
    vet: req.user._id,
  });

  if (!appointment) {
    return res.status(403).json({
      message: "Access denied. No appointment found with this pet.",
      success: false,
    });
  }

  // Fetch pet info
  const pet = await Pet.findById(petId).populate("owner", "name email");
  if (!pet) {
    return res.status(404).json({
      message: "Pet not found",
      success: false,
    });
  }

  // Fetch health records
  const healthRecords = await HealthRecord.find({ pet: petId }).populate(
    "treatments.vet",
    "name email"
  );

  res.status(200).json({
    message: "Pet medical records retrieved successfully",
    success: true,
    data: {
      pet,
      healthRecords,
    },
  });
});
