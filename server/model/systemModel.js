import mongoose from "mongoose";

const systemSettingSchema = new mongoose.Schema(
  {
    banner: {
      list: {
        type: [String],
        default: [],
      },
      activeIndex: {
        type: Number,
        default: 0,
      },
    },
    discount: {
      enabled: { type: Boolean, default: false },
      startAt: {
        type: Date,
      },
      endAt: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("SystemSetting", systemSettingSchema);
