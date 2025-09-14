import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vet: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ["pending", "approved", "rescheduled", "completed"], default: "pending" },
  diagnosis: String,
  prescribedMedication: [String],
  followUp: Date
}, { timestamps: true });

export default mongoose.model("Appointment", appointmentSchema);
