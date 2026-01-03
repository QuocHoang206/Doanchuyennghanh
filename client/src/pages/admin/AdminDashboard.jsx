import { useState } from "react";

import { useEffect } from "react";
import postApi from "../../services/postService";
function AdminDashboard() {
  const [statusOrder, setStatusOrder] = useState(0);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    postApi.statusOrder()
      .then((res) => {
      setStatusOrder(res.data.orderStatus);
    });

    postApi.getAllOrders()
    .then((res) => {
      setOrders(res.data.data);
    });
  }, []);
  const stats = [
    {
      title: "Doanh thu",
      value: Number(statusOrder || 0).toLocaleString() + " đ",
      color: "bg-blue-600",
    },
    { title: "Đơn hàng", value: orders.length, color: "bg-green-600" },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {stats.map((item, index) => (
          <div
            key={index}
            className={`${item.color} text-white rounded-xl p-6 shadow-lg`}
          >
            <p className="text-lg">{item.title}</p>
            <h3 className="text-2xl font-semibold mt-2">{item.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Đơn hàng gần đây</h2>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3">Mã đơn</th>
              <th className="p-3">Khách hàng</th>
              <th className="p-3">Tổng tiền</th>
              <th className="p-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b">
                <td className="p-3">{o._id}</td>
                <td className="p-3">{o.name}</td>
                <td className="p-3 text-blue-600 font-semibold">
                  {o.total.toLocaleString()} đ
                </td>

                <td className="p-3">
                  {o.status === "Chờ xác nhận" && (
                    <span className="px-3 py-1 bg-orange-500 text-white rounded">
                      Chờ xác nhận
                    </span>
                  )}

                  {o.status === "Đã xác nhận" && (
                    <span className="px-3 py-1 bg-blue-500 text-white rounded">
                      Đã xác nhận
                    </span>
                  )}

                  {o.status === "Hoàn thành" && (
                    <span className="px-3 py-1 bg-green-600 text-white rounded">
                      Hoàn thành
                    </span>
                  )}

                  {o.status === "Đã hủy" && (
                    <span className="px-3 py-1 bg-red-600 text-white rounded">
                      Đã hủy
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
