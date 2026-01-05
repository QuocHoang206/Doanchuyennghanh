import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postApi from "../../services/postService";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const loadOrders = async () => {
    const res = await postApi.getAllOrders();
    const allOrders = res.data.data || [];

    // 🔒 chỉ lấy đơn của user đang login
    const myOrders = allOrders.filter(
  (o) => String(o.userId) === String(user._id)
);


    setOrders(myOrders);
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadOrders();
  }, []);

  const handleCancel = async (id) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;
    await postApi.cancelOrder(id);
    loadOrders();
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">
        Đơn hàng của tôi
      </h1>

      {orders.length === 0 && (
        <p className="text-gray-500">Chưa có đơn hàng</p>
      )}

      {orders.map((o) => (
        <div
          key={o._id}
          className="bg-white border rounded shadow p-5 mb-5"
        >
          <div className="flex justify-between mb-3">
            <div>
              <p>
                <b>Mã đơn:</b> {o._id}
              </p>
              <p>
                <b>Ngày đặt:</b>{" "}
                {new Date(o.createdAt).toLocaleString()}
              </p>
            </div>

            <span
              className={`font-semibold ${
                o.status === "Chờ xác nhận"
                  ? "text-yellow-600"
                  : o.status === "Đang giao"
                  ? "text-blue-600"
                  : o.status === "Hoàn thành"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {o.status}
            </span>
          </div>

          {/* ITEMS */}
          {o.items.map((item, i) => (
            <div
              key={i}
              className="flex justify-between border-b py-2 text-sm"
            >
              <span>
                {item.title} ({item.size || "-"}) ×{" "}
                {item.quantity}
              </span>
              <span>
                {(item.price * item.quantity).toLocaleString()} đ
              </span>
            </div>
          ))}

          <div className="text-right font-bold mt-3">
            Tổng tiền: {o.total.toLocaleString()} đ
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => navigate(`/order/${o._id}`)}
              className="px-4 py-2 border rounded"
            >
              Xem chi tiết
            </button>

            {/* ❌ CHỈ CHO HỦY KHI CHỜ XÁC NHẬN */}
            {o.status === "Chờ xác nhận" && (
              <button
                onClick={() => handleCancel(o._id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Hủy đơn
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OrderList;
