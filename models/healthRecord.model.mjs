import mongoose from 'mongoose';

const healthRecordSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: "Pet", required: true },
  vaccinationDates: Date,
  illness: String,
  treatment: {
      date: Date,
      description: String,
      vet: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  // documents: [String], // URLs for X-rays, reports, certificates
  insurance: {
    policyNumber: String,
    provider: String,
    // claims: [String] // claim document URLs
  }
}, { timestamps: true });

export default mongoose.model("HealthRecord", healthRecordSchema);
