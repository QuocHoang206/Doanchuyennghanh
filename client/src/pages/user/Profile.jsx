import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postApi from "../../services/postService";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ LOAD PROFILE TỪ SERVER
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    postApi
      .getMyProfile()
      .then((res) => {
        setUser(res.data.user);
        setForm({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          phone: res.data.user.phone || "",
          address: res.data.user.address || "",
        });

        // sync lại localStorage
        localStorage.setItem("user", JSON.stringify(res.data.user));
      })
      .catch((err) => {
  if (err.response?.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  } else {
    alert("Lỗi tải thông tin cá nhân");
  }
});

  }, []);

  if (!user) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ UPDATE PROFILE
  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await postApi.updateMyProfile({
        name: form.name,
        phone: form.phone,
        address: form.address,
      });

      const updatedUser = {
        ...user, // giữ _id, email, role
        name: res.data.user.name,
        phone: res.data.user.phone,
        address: res.data.user.address,
      };

      setUser(updatedUser);
      setForm({
        ...form,
        name: updatedUser.name,
        phone: updatedUser.phone,
        address: updatedUser.address,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);

      alert("Cập nhật thành công!");
    } catch (err) {
      alert("Cập nhật thất bại" + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        Thông tin cá nhân
      </h1>

      <div className="bg-white shadow rounded-xl p-8 space-y-5">
        <div>
          <label className="font-semibold block mb-1">Họ tên</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input
            value={form.email}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Số điện thoại</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border p-3 rounded"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Địa chỉ</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            disabled={!editing}
            className="w-full border p-3 rounded"
          />
        </div>

        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="w-full py-3 bg-blue-600 text-white rounded"
          >
            Đổi thông tin
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 py-3 bg-green-600 text-white rounded"
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
            <button
              onClick={() => {
                setEditing(false);
                setForm({
                  name: user.name,
                  email: user.email,
                  phone: user.phone,
                  address: user.address,
                });
              }}
              className="flex-1 py-3 bg-gray-400 text-white rounded"
            >
              Hủy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
