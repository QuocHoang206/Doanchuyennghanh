import SystemSetting from "../model/systemModel.js";
import { uploadToCloudinary } from "../middleware/uploadMiddleware.js";

export const getSystemSetting = async (req, res) => {
  try {
    let setting = await SystemSetting.findOne();

    if (!setting) {
      setting = await SystemSetting.create({});
    }

    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSystemSetting = async (req, res) => {
  try {
    let setting = await SystemSetting.findOne();

    if (!setting) {
      setting = await SystemSetting.create(req.body);
    } else {
      if (req.body.banner) {
        setting.banner = {
          ...setting.banner.toObject(),
          ...req.body.banner,
        };
      }

      if (req.body.discount) {
        setting.discount = {
          ...setting.discount.toObject(),
          ...req.body.discount,
        };
      }

      await setting.save();
    }

    res.json({ success: true, data: setting });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



export const uploadBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Thiếu ảnh banner" });
    }

    const setting = await SystemSetting.findOne();
    if (!setting) {
      return res.status(404).json({ message: "System setting not found" });
    }

    // ✅ UPLOAD CLOUDINARY
    const result = await uploadToCloudinary(
      req.file.buffer,
      "banners"
    );

    if (!setting.banner) {
      setting.banner = { list: [], activeIndex: 0 };
    }

    setting.banner.list.push(result.secure_url);
    await setting.save();

    res.json({
      success: true,
      image: result.secure_url, // ✅ URL CLOUDINARY
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

