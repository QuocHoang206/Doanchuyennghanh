import express from "express";
import {
  getSystemSetting,
  updateSystemSetting,
  uploadBanner,
} from "../controller/systemController.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
const router = express.Router();

router.get("/", getSystemSetting);
router.put("/", verifyToken, isAdmin, updateSystemSetting);
router.post("/banner", verifyToken, isAdmin, upload.single("banner"), uploadBanner);

export default router;
