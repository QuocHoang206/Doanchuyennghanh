import { useEffect, useState } from "react";
import postApi from "../../services/postService";

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchEmail, setSearchEmail] = useState(""); // 🔍 SEARCH EMAIL

  const loadOrders = () => {
    postApi
      .getAllOrders()
      .then((res) => setOrders(res.data.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;
    await postApi.cancelOrder(id);
    loadOrders();
  };

  const updateStatus = async (id, status) => {
    try {
      await postApi.updateOrderStatus(id, { status });
      alert("Cập nhật trạng thái thành công!");
      loadOrders();
    } catch (err) {
      console.log(err);
      alert("Lỗi cập nhật trạng thái!");
    }
  };

  // 🔎 FILTER THEO EMAIL
  const filteredOrders = orders.filter((o) =>
    o.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Quản lý đơn hàng
      </h1>

      {/* 🔍 SEARCH BAR */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="🔍 Tìm theo email khách hàng..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-4 py-2 rounded w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <table className="w-full border-collapse bg-white shadow">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 border">Khách hàng</th>
            <th className="p-3 border">Số SP</th>
            <th className="p-3 border">Thanh toán</th>
            <th className="p-3 border">Tổng tiền</th>
            <th className="p-3 border">Trạng thái</th>
            <th className="p-3 border">Hành động</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((o) => (
            <tr key={o._id} className="text-center border">
              <td className="p-3 border">
                {o.name}
                <br />
                <span className="text-sm text-gray-600">{o.email}</span>
              </td>

              <td className="p-3 border">{o.items.length}</td>

              <td className="p-3 border">
                {o.paymentMethod === "cod" ? "COD" : "QR Banking"}
              </td>

              <td className="p-3 border font-semibold">
                {o.total.toLocaleString()} đ
              </td>

              <td className="p-3 border font-semibold">{o.status}</td>

              <td className="p-3 border space-y-2">
                {/* XEM CHI TIẾT */}
                <button
                  onClick={() => {
                    setSelectedOrder(o);
                    setShowModal(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded block w-full"
                >
                  Xem chi tiết
                </button>

                {/* XÁC NHẬN */}
                {o.status === "Chờ xác nhận" && (
                  <button
                    onClick={() => updateStatus(o._id, "Đã xác nhận")}
                    className="px-3 py-1 bg-yellow-500 text-white rounded block w-full"
                  >
                    Xác nhận
                  </button>
                )}

                {/* HOÀN THÀNH */}
                {o.status === "Đã xác nhận" && (
                  <button
                    onClick={() => updateStatus(o._id, "Hoàn thành")}
                    className="px-3 py-1 bg-green-600 text-white rounded block w-full"
                  >
                    Hoàn thành
                  </button>
                )}

                {/* HỦY */}
                {o.status === "Chờ xác nhận" && (
                  <button
                    onClick={() => handleCancel(o._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded block w-full"
                  >
                    Hủy đơn
                  </button>
                )}

                {/* HOÀN THÀNH → KHÓA */}
                {o.status === "Hoàn thành" && (
                  <span className="block text-green-600 font-semibold text-sm">
                    ✔ Đã hoàn thành
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredOrders.length === 0 && (
        <p className="text-center mt-4 text-gray-600">
          Không tìm thấy đơn hàng phù hợp
        </p>
      )}

      {/* ================= MODAL CHI TIẾT ================= */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded-lg p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">
              Chi tiết đơn hàng
            </h2>

            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="flex gap-4 border-b py-3">
                <img
                  src={`http://localhost:3000${item.image}`}
                  className="w-20 h-20 object-cover rounded border"
                />

                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p>Size: {item.size}</p>
                  <p>SL: {item.quantity}</p>
                  <p className="text-red-600 font-bold">
                    {(item.price * item.quantity).toLocaleString()} đ
                  </p>
                </div>
              </div>
            ))}

            <div className="mt-4 flex justify-between text-lg font-semibold">
              <span>Tổng tiền</span>
              <span className="text-red-600">
                {selectedOrder.total.toLocaleString()} đ
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderManager;
  