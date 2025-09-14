import mongoose from 'mongoose';

const shelterPetSchema = new mongoose.Schema({
  shelter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  breed: String,
  age: Number,
  healthStatus: String,
  images: [String],
  careLogs: [
    {
      date: Date,
      feeding: String,
      grooming: String,
      medical: String
    }
  ],
  adoptionStatus: { type: String, enum: ["available", "adopted", "pending"], default: "available" }
}, { timestamps: true });

export default mongoose.model("ShelterPet", shelterPetSchema);
