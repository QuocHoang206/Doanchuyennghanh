import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  title: String,
  image: String,
  size: String,
  price: Number,
  quantity: Number,
});

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    name: String,
    email: String,
    address: String,
    district: String,
    ward: String,

    items: [orderItemSchema],

    paymentMethod: { type: String, enum: ["cod", "qr"], default: "cod" },

    total: Number,

    ship: { 

      type: String,
      enum: ["grab", "be"],
      default: null,
    },

    status: {
      type: String,
      enum: ["Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"],
      default: "Chờ xác nhận",
    },

    cancelledAt: Date,
    completedAt: Date,

  },
  { timestamps: true }
);

orderSchema.index(
  { cancelledAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 }
);

export default mongoose.model("Order", orderSchema);
