import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalAmount: Number,
  status: { type: String, enum: ["placed", "cancelled"], default: "placed" }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
