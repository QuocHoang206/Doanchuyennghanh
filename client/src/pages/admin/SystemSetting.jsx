import { useEffect, useState } from "react";
import postApi from "../../services/postService";

function SystemSetting() {
  const [loading, setLoading] = useState(false);
  const [setting, setSetting] = useState({
    banner: { list: [], activeIndex: 0 },
    discount: { enabled: false, startAt: "", endAt: "" },
  });

  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  useEffect(() => {
    postApi.getSystemSetting().then((res) => {
      const data = res.data.data;
      const set = {
        ...data,
        discount: {
          ...data.discount,
          startAt: data.discount?.startAt?.slice(0, 16) || "",
          endAt: data.discount?.endAt?.slice(0, 16) || "",
        },
      }
      console.log("Loaded system setting:", set);
      setSetting(set);
    });
  }, []);

  const handleUploadBanner = async (file) => {
    const formData = new FormData();
    formData.append("banner", file);

    const res = await postApi.uploadBanner(formData, authConfig);

    setSetting((prev) => ({
      ...prev,
      banner: {
        ...prev.banner,
        list: [...prev.banner.list, res.data.image],
      },
    }));
  };

  const updateActiveBanner = async (index) => {
    const newSetting = {
      ...setting,
      banner: { ...setting.banner, activeIndex: index },
    };

    await postApi.updateSystemSetting(newSetting, authConfig);
    setSetting(newSetting);
  };

const handleSave = async () => {
  setLoading(true);

  const payload = {
    ...setting,
    discount: {
      ...setting.discount,
      startAt: setting.discount.startAt
        ? new Date(setting.discount.startAt).toISOString()
        : null,
      endAt: setting.discount.endAt
        ? new Date(setting.discount.endAt).toISOString()
        : null,
    },
  };

  await postApi.updateSystemSetting(payload, authConfig);

  setLoading(false);
  alert("Lưu cấu hình thành công!");
};


  const handleDeleteBanner = async (index) => {
    const list = setting.banner.list.filter((_, i) => i !== index);
    const newSetting = {
      ...setting,
      banner: { list, activeIndex: 0 },
    };

    await postApi.updateSystemSetting(newSetting, authConfig);
    setSetting(newSetting);
  };
  return (
    <div className="p-8 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-blue-700">System Setting</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Quản lý banner trang Home
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleUploadBanner(e.target.files[0])}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {setting.banner.list.map((img, index) => (
            <div
              key={index}
              className={`relative border-4 rounded-xl overflow-hidden ${
                setting.banner.activeIndex === index
                  ? "border-blue-600"
                  : "border-transparent"
              }`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteBanner(index);
                }}
                className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700"
              >
                ×
              </button>

              <div onClick={() => updateActiveBanner(index)}>
                <img
                  src={img}
                  className="w-full h-40 object-cover"
                />
                {setting.banner.activeIndex === index && (
                  <p className="text-center text-blue-600 font-semibold py-2">
                    Đang hiển thị
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Thời gian giảm giá</h2>

        <label className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            checked={setting.discount.enabled}
            onChange={(e) =>
              setSetting({
                ...setting,
                discount: {
                  ...setting.discount,
                  enabled: e.target.checked,
                },
              })
            }
          />
          <span>Bật chương trình giảm giá</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <input
            type="datetime-local"
            value={setting.discount.startAt}
            onChange={(e) =>
              setSetting({
                ...setting,
                discount: {
                  ...setting.discount,
                  startAt: e.target.value,
                },
              })
            }
            className="border p-3 rounded"
          />
          <input
            type="datetime-local"
            value={setting.discount.endAt}
            onChange={(e) =>
              setSetting({
                ...setting,
                discount: {
                  ...setting.discount,
                  endAt: e.target.value,
                },
              })
            }
            className="border p-3 rounded"
          />
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-3 bg-blue-600 text-white rounded"
      >
        {loading ? "Đang lưu..." : "Lưu cấu hình"}
      </button>
    </div>
  );
}

export default SystemSetting;
