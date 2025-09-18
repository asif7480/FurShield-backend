import mongoose from 'mongoose';

const petSchema = new mongoose.Schema({ 
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  species: { type: String, required: true },
  breed: String,
  age: Number,
  gender: String,
  medicalHistory: String,
  image: String
}, { timestamps: true });

export default mongoose.model("Pet", petSchema);
