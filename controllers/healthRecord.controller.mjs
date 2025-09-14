import asyncHandler from 'express-async-handler';

import HealthRecord from '../models/healthRecord.model.mjs';

/**
 * @route   POST /api/v1/health-records
 * @desc    Create a new health record for a pet
 * @access  Private (Owner/Vet)
 */
export const addHealthRecord = asyncHandler(async (req, res) => {
  const { pet, vaccinationDates, allergies, illnesses, treatments, documents, insurance } = req.body;

  if (!pet) {
    return res.status(400).json({ message: "Pet ID is required", success: false });
  }

  // Check vaccinationDates (if provided) for future only
  if (vaccinationDates && Array.isArray(vaccinationDates)) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const date of vaccinationDates) {
      const vDate = new Date(date);
      if (vDate <= today) {
        return res.status(400).json({
          message: "Vaccination dates must be strictly in the future (not today or past)",
          success: false,
        });
      }
    }
  }

  const record = await HealthRecord.create({
    pet,
    vaccinationDates,
    allergies,
    illnesses,
    treatments,
    documents,
    insurance,
  });

  return res.status(201).json({
    message: "Health record created successfully",
    success: true,
    data: record,
  });
});


/**
 * @route   GET /api/v1/health-records/:petId
 * @desc    Get all health records for a specific pet
 * @access  Private (Owner/Vet)
 */
export const getHealthRecordsByPet = asyncHandler(async (req, res) => {
  const records = await HealthRecord.find({ pet: req.params.petId })
    .populate("pet")
    .populate("treatments.vet", "name email");

  return res.status(200).json({
    message: "Health records retrieved successfully",
    success: true,
    data: records,
  });
});

/**
 * @route   PUT /api/v1/health-records/:id
 * @desc    Update a health record by ID
 * @access  Private (Owner/Vet)
 */
export const updateHealthRecord = asyncHandler(async (req, res) => {
  const updates = req.body;
  const record = await HealthRecord.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    return res.status(404).json({ message: "Health record not found", success: false });
  }

  return res.status(200).json({
    message: "Health record updated successfully",
    success: true,
    data: record,
  });
});

/**
 * @route   DELETE /api/v1/health-records/:id
 * @desc    Delete a health record by ID
 * @access  Private (Owner/Vet)
 */
export const deleteHealthRecord = asyncHandler(async (req, res) => {
  const record = await HealthRecord.findByIdAndDelete(req.params.id);

  if (!record) {
    return res.status(404).json({ message: "Health record not found", success: false });
  }

  return res.status(200).json({
    message: "Health record deleted successfully",
    success: true,
  });
});
