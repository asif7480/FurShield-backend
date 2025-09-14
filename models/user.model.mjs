import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  profileImg: { type: String, default: null },

  role: {
    type: String,
    enum: ["owner", "vet", "shelter", "admin"],
    required: true
  },

  // For vets
  specialization: String,
  experience: String,
  availableTimeSlots: [String],

  // For shelter
  shelterName: String,
  contactPerson: String,

  // Common features
  ratings: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    }
  ],
  // Forgot password
  resetToken: { type: String },
  resetTokenExpiry: { type: Date }
  
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User