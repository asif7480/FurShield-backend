import asyncHandler from 'express-async-handler';

import Appointment from '../models/appointment.model.mjs';

/**
 * @route   POST /api/v1/appointments
 * @desc    Create a new appointment (Owner books vet for a pet)
 * @access  Private (Owner)
 */
export const createAppointment = asyncHandler(async (req, res) => {
  const { pet, vet, date } = req.body;

  if (!pet || !vet || !date) {
    return res.status(400).json({ message: "Pet, Vet and Date are required", success: false });
  }

  const appointmentDate = new Date(date);
  const today = new Date();

  // Normalize today's date to midnight (00:00) so it compares only by day
  today.setHours(0, 0, 0, 0);

  if (appointmentDate <= today) {
    return res.status(400).json({
      message: "Appointment date must be in the future (not today or past)",
      success: false,
    });
  }

  const appointment = await Appointment.create({
    pet,
    owner: req.user._id,
    vet,
    date: appointmentDate,
  });

  return res.status(201).json({
    message: "Appointment created successfully",
    success: true,
    data: appointment,
  });
});


/**
 * @route   GET /api/v1/appointments/owner
 * @desc    Get all appointments of the logged-in owner
 * @access  Private (Owner)
 */
export const getOwnerAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ owner: req.user._id })
    .populate("pet")
    .populate("owner")
    .populate("vet", "name email specialization");

  return res.status(200).json({
    message: "Owner appointments retrieved successfully",
    success: true,
    data: appointments,
  });
});

/**
 * @route   GET /api/v1/appointments/vet
 * @desc    Get all appointments of the logged-in vet
 * @access  Private (Vet)
 */
export const getVetAppointments = asyncHandler(async (req, res) => {
  const appointments = await Appointment.find({ vet: req.user._id })
    .populate("pet")
    .populate("vet")
    .populate("owner", "name email");

  return res.status(200).json({
    message: "Vet appointments retrieved successfully",
    success: true,
    data: appointments,
  });
});

export const getAllAppointments = asyncHandler( async(req, res) => {
  const appointments = await Appointment.find()

  return res.status(200).json(appointments);
})

/**
 * @route   PUT /api/v1/appointments/:id
 * @desc    Update appointment (status, diagnosis, meds, follow-up)
 * @access  Private (Vet/Owner depending on action)
 */
export const updateAppointment = asyncHandler(async (req, res) => {
  const updates = req.body;

  const appointment = await Appointment.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  })
    .populate("pet")
    .populate("owner", "name email")
    .populate("vet", "name email specialization");

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found", success: false });
  }

  return res.status(200).json({
    message: "Appointment updated successfully",
    success: true,
    data: appointment,
  });
});

/**
 * @route   DELETE /api/v1/appointments/:id
 * @desc    Cancel an appointment (Owner only)
 * @access  Private (Owner)
 */
export const deleteAppointment = asyncHandler(async (req, res) => {
  const appointment = await Appointment.findOneAndDelete({
    _id: req.params.id,
    owner: req.user._id,
  });

  if (!appointment) {
    return res.status(404).json({ message: "Appointment not found or not yours", success: false });
  }

  return res.status(200).json({
    message: "Appointment deleted successfully",
    success: true,
  });
});
