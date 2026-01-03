import express from "express";
import {
  createProducts,
   getProductById,
  updateProduct,
  readProduct,
  deleteProduct,
  searchProducts
} from "../controller/productController.js";

import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();


router.post("/", verifyToken, isAdmin, upload.single("image"), createProducts);
router.get("/:id", getProductById);
router.get("/", readProduct);
router.put("/:id", verifyToken, isAdmin, upload.single("image"), updateProduct);
router.delete("/:id", verifyToken, isAdmin, deleteProduct);
router.get("/search", searchProducts);

export default router;


