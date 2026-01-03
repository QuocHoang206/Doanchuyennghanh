import SystemSetting from "../model/systemModel.js";

/**
 * GET /api/settings
 */
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

/**
 * PUT /api/settings
 * Cập nhật cấu hình hệ thống (MERGE, không ghi đè)
 */
export const updateSystemSetting = async (req, res) => {
  try {
    let setting = await SystemSetting.findOne();

    if (!setting) {
      setting = await SystemSetting.create(req.body);
    } else {
      // MERGE BANNER
      if (req.body.banner) {
        setting.banner = {
          ...setting.banner.toObject(),
          ...req.body.banner,
        };
      }

      // MERGE DISCOUNT (GIỮ NGUYÊN)
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

/**
 * POST /api/settings/banner
 * Upload banner → thêm vào banner.list
 */


export const uploadBanner = async (req, res) => {
  try {
    const setting = await SystemSetting.findOne();
    if (!setting)
      return res.status(404).json({ message: "System setting not found" });

    // đường dẫn ảnh giống product
    const imagePath = `/uploads/${req.file.filename}`;

    // nếu banner chưa có list thì tạo
    if (!setting.banner.list) {
      setting.banner.list = [];
      setting.banner.activeIndex = 0;
    }

    setting.banner.list.push(imagePath);
    await setting.save();

    res.json({
      success: true,
      image: imagePath,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
