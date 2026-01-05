import SystemSetting from "../model/systemModel.js";

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
    const setting = await SystemSetting.findOne();
    if (!setting)
      return res.status(404).json({ message: "System setting not found" });

    const imagePath = `/uploads/${req.file.filename}`;

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
