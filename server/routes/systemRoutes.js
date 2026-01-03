import express from "express";
import {
  getSystemSetting,
  updateSystemSetting,
  uploadBanner,
} from "../controller/systemController.js";
import { upload } from "../middleware/uploadMiddleware.js";
const router = express.Router();

router.get("/", getSystemSetting);
router.put("/", updateSystemSetting);
router.post("/banner", upload.single("banner"), uploadBanner);

export default router;
