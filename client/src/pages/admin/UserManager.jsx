import { useEffect, useState } from "react";
import postApi from "../../services/postService";

function UserManager() {
  const [users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const loadUsers = () => {
    postApi
      .getUsers({
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = (id) => {
    if (!confirm("Bạn có chắc muốn xóa người dùng này?")) return;

    postApi
      .deleteUser(id, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
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
      .updateUser(editUser, form, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then(() => {
        alert("Cập nhật thành công!");
        setEditUser(null);
        loadUsers();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Quản lý người dùng
      </h1>

      <table className="w-full bg-white shadow rounded-xl overflow-hidden">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3">Tên</th>
            <th className="p-3">Email</th>
            <th className="p-3">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-b text-center">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>

              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(u._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editUser && (
        <div className="mt-10 bg-white shadow rounded-xl p-6 w-full md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Sửa thông tin người dùng</h2>

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

            <button className="bg-blue-600 text-white py-2 rounded">
              Lưu thay đổi
            </button>

            <button
              className="bg-gray-400 text-white py-2 rounded"
              type="button"
              onClick={() => setEditUser(null)}
            >
              Hủy
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default UserManager;
