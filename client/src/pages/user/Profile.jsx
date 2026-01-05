import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    if (storedUser._id !== id) {
      navigate("/");
      return;
    }

    setUser(storedUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate, token]);

  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">
        Thông tin cá nhân
      </h1>

      <div className="bg-white shadow rounded-xl p-8 space-y-5">
        <div>
          <label className="font-semibold block mb-1">Họ tên</label>
          <input
            type="text"
            value={user.name}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            value={user.email}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Số điện thoại</label>
          <input
            type="text"
            value={user.phone}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="font-semibold block mb-1">Địa chỉ</label>
          <input
            type="text"
            value={user.address}
            disabled
            className="w-full border p-3 rounded bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
}

export default Profile;
