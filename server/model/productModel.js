import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, min: 0},
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true },
    color: { type: String, required: true },
    category: { type: String, required: true },
    size: { type: [String], required: true},
    image: { type: String },
    stock: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
