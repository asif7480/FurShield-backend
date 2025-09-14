import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ["food", "grooming", "toys", "accessories"], required: true },
  price: { type: Number, required: true },
  description: String,
  image: { type: String, default: "" },
  ratings: [
    {
      by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      rating: { type: Number, min: 1, max: 5 },
      comment: String
    }
  ]
}, { timestamps: true });

const Product =  mongoose.model("Product", productSchema);
export default Product