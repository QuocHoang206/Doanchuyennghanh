import express from "express";
import {
  getCommentsByProduct,
  createComment,
} from "../controller/commentController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:productId", getCommentsByProduct);
router.post("/", verifyToken, createComment);

export default router;
