import { useEffect, useState } from "react";
import postApi from "../../services/postService";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [showAdminOnly, setShowAdminOnly] = useState(false);

  let currentUserId = null;
  let currentUserRole = null;

  try {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      currentUserId = payload._id;
      currentUserRole = payload.role;
    }
  } catch (err) {
    console.error("Invalid token" + err);
  }

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loadUsers = () => {
    postApi
      .getUsers()
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    postApi
      .deleteUser(id)
      .then(() => {
        alert("Xóa thành công!");
        loadUsers();
      })
      .catch((err) => console.log(err));
  };

  const handleEdit = (u) => {
    setEditUser(u._id);
    setForm({
      name: u.name,
      email: u.email,
      password: "",
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    postApi
      .updateUser(editUser, form)
      .then(() => {
        alert("Cập nhật thành công!");
        setEditUser(null);
        loadUsers();
      })
      .catch((err) => console.log(err));
  };

  const handleRole = (id, role) => {
    if (!confirm("Bạn có chắc muốn thay đổi quyền người dùng?")) return;

    postApi
      .updateUserRole(id, { role })
      .then(() => {
        alert("Cập nhật quyền thành công");
        loadUsers();
      })
      .catch((err) => console.log(err));
  };
const handleSearch = (e) => {
  const query = e.target.value;

  if (!query.trim()) {
    loadUsers(); 
    return;
  }

  postApi
    .searchUsers({ q: query })
    .then((res) => {
      setUsers(res.data.users);
    })
    .catch((err) => console.log(err));
};


  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Quản lý người dùng
      </h1>

      <div className="mb-4 flex gap-3">
        <button
          onClick={() => setShowAdminOnly(!showAdminOnly)}
          className={`px-4 py-2 rounded text-white ${
            showAdminOnly ? "bg-gray-600" : "bg-purple-600"
          }`}
        >
          {showAdminOnly ? "Tất cả user" : "Admin"}
        </button>
      </div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          onChange={handleSearch}
          className="border p-2 rounded w-full"
        />
      </div>
      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3">Tên</th>
            <th className="p-3">Email</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((u) =>
              showAdminOnly
                ? u.role === "admin" || u.role === "superadmin"
                : true
            )
            .map((u) => (
              <tr key={u._id} className="border-b text-center">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>

                <td className="p-3 space-x-2">
                  {currentUserRole === "superadmin" &&
                    u._id !== currentUserId && (
                      <button
                        onClick={() =>
                          handleRole(
                            u._id,
                            u.role === "admin" ? "user" : "admin"
                          )
                        }
                        className="px-3 py-1 bg-purple-600 text-white rounded"
                      >
                        {u.role === "admin" ? "Gỡ Admin" : "Cấp Admin"}
                      </button>
                    )}

                  {(currentUserRole === "superadmin" ||
                    (currentUserRole === "admin" && u.role === "user")) &&
                    !(u.role === "superadmin" && u._id === currentUserId) && (
                      <button
                        onClick={() => handleEdit(u)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                      >
                        Sửa
                      </button>
                    )}

                  {currentUserRole === "superadmin" &&
                    u._id !== currentUserId && (
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded"
                      >
                        Xóa
                      </button>
                    )}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {editUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Sửa thông tin người dùng
            </h2>
            <button
              onClick={() => setEditUser(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ✕
            </button>

            <form className="grid gap-4" onSubmit={handleUpdate}>
              <input
                type="text"
                placeholder="Tên"
                className="border p-2 rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />

              <input
                type="password"
                placeholder="Mật khẩu mới (hoặc để trống)"
                className="border p-2 rounded"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Lưu thay đổi
                </button>

                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManager;
