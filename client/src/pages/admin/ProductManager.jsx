import { useEffect, useState } from "react";

import postApi from "../../services/postService";

function ProductManager() {
  const [products, setProducts] = useState([]);
  const [preview, setPreview] = useState(null);

  const COLORS = ["Đỏ", "Xanh lá", "Đen", "Trắng", "Vàng"];
  const CATEGORIES = ["Giày", "Balo", "Bóng"];

  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    color: "",
    category: "",
    size: "",
    stock: "",
    image: null,
    discount: "",
  });

  const [editId, setEditId] = useState(null);

  const loadProducts = () => {
    postApi.getProducts().then((res) => setProducts(res.data.data));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleEdit = (p) => {
    setForm({
      title: p.title,
      price: p.price,
      size: Array.isArray(p.size) ? p.size.join(",") : p.size || "",
      description: p.description,
      color: p.color,
      category: p.category,
      stock: p.stock,
      image: null,
      discount: p.discount,
    });

    setPreview(p.image);
    setEditId(p._id);
  };

  const handleSubmit = async (e) => {
    if (editId && !form.image) {
  alert("⚠️ Khi sửa sản phẩm, bạn PHẢI chọn lại ảnh để chuyển sang Cloudinary");
  return;
}
    e.preventDefault();

    const formData = new FormData();
    Object.entries({
      title: form.title,
      description: form.description,
      color: form.color,
      category: form.category,
      discount: form.discount,
      price: Number(form.price),
      stock: Number(form.stock),
      size: form.size
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .join(","),
    }).forEach(([k, v]) => formData.append(k, v));

    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    try {
      if (editId) {
        await postApi.updateProduct(editId, formData, authConfig);
      } else {
        await postApi.createProducts(formData, authConfig);
      }

      alert("Lưu sản phẩm thành công!");
      setEditId(null);
      setPreview(null);
      loadProducts();
    } catch (err) {
      console.log(err);
      alert("Lỗi khi lưu sản phẩm!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    await postApi.deleteProduct(id, authConfig);
    loadProducts();
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Quản lý sản phẩm
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow grid grid-cols-2 gap-4"
      >
        <input
          type="text"
          name="title"
          placeholder="Tên sản phẩm"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Giá"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          name="discount"
          placeholder="Giảm giá (%)"
          value={form.discount}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">-- Chọn danh mục --</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="size"
          placeholder="Kích cỡ (phân tách bằng dấu , )"
          value={form.size}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="color"
          value={form.color}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">-- Chọn màu --</option>
          {COLORS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="border p-2 rounded"
        />

        {preview && (
          <div className="col-span-2">
            <p className="text-gray-600 mb-1">Ảnh xem trước:</p>
            <img
              src={preview}
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}

        <input
          type="number"
          name="stock"
          placeholder="Tồn kho"
          value={form.stock}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Mô tả"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded col-span-2"
          required
        />

        <button
          type="submit"
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {editId ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        </button>
      </form>

      <table className="w-full mt-8 border-collapse bg-white shadow">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 border">Ảnh</th>
            <th className="p-3 border">Tên</th>
            <th className="p-3 border">Giá</th>
            <th className="p-3 border">Size</th>
            <th className="p-3 border">Danh mục</th>
            <th className="p-3 border">Màu</th>
            <th className="p-3 border">Tồn kho</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="text-center border">
              <td className="p-3 border">
                <img
                  src={p.image}
                  className="w-16 h-16 object-cover mx-auto rounded"
                />
              </td>

              <td className="p-3 border">{p.title}</td>
              <td className="p-3 border">{p.price.toLocaleString()} đ</td>

              <td className="p-3 border">
                {Array.isArray(p.size) ? p.size.join(", ") : p.size}
              </td>

              <td className="p-3 border">{p.category}</td>
              <td className="p-3 border">{p.color}</td>
              <td className="p-3 border">{p.stock}</td>

              <td className="p-3 border space-x-2">
                
                <button
                  onClick={() => handleEdit(p)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Sửa
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {products.length === 0 && (
        <p className="text-center text-gray-500 mt-4">Không có sản phẩm nào.</p>
      )}
    </div>
  );
}

export default ProductManager;
