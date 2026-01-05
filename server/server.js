import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./routes/productRoutes.js";
import authRouter from "./routes/authRoutes.js";
import orderRouter from "./routes/orderRoutes.js";
import systemRouter from "./routes/systemRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin:["http://localhost:5173",
          "https://doanchuyennghanh-drab.vercel.app"
  ],
  credentials:true,
}

));
app.use(express.json());

// Test 
app.get("/api/home", (req, res) => {
  res.send("Trang Home từ server NodeJS!");
});

// Connect MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("[DATABASE] Connected to MongoDB"))
  .catch((error) => console.error("[DATABASE] Connection error:", error));

// API Routes
app.use("/api/products", productRouter);
app.use("/api/auth", authRouter);
app.use("/uploads", express.static("uploads"));
app.use("/api/orders", orderRouter);
app.use("/api/settings", systemRouter);
 app.use("/api/comments", commentRouter);

app.listen(PORT, () => {
  console.log(`[SERVER] Server is running on http://localhost:${PORT}`);
});
