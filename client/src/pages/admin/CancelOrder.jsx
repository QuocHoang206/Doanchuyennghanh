import { useEffect, useState } from "react";
import postApi from "../../services/postService";

function CancelledOrder() {
  const [orders, setOrders] = useState([]);
  const [searchEmail, setSearchEmail] = useState("");
  useEffect(() => {
    postApi
      .getCancelledOrders()
      .then((res) => setOrders(res.data.data))
      .catch((err) => console.log(err));
  }, []);
  const SearchedOrders = orders.filter((o) =>
    o.email.toLowerCase().includes(searchEmail.toLowerCase()) ||
    o.name.toLowerCase().includes(searchEmail.toLowerCase())
  );

 
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-red-600">
        Đơn hàng đã hủy (tự xóa sau 30 ngày)
      </h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Tìm theo email khách hàng..."
          className="border border-gray-300 rounded-md px-4 py-2 w-full md:w-1/3"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>
      <table className="w-full border bg-white shadow">
        <thead>
          <tr className="bg-red-500 text-white">
            <th className="p-3 border">Khách hàng</th>
            <th className="p-3 border">Sản phẩm</th>
            <th className="p-3 border">Tổng tiền</th>
            <th className="p-3 border">Ngày hủy</th>
          </tr>
        </thead>

        <tbody>
          {SearchedOrders.map((o) => (
            <tr key={o._id} className="border text-center">
              <td className="p-3 border">
                {o.name}
                <br />
                {o.email}
              </td>

              <td className="p-3 border text-left">
                {o.items.map((i, idx) => (
                  <div key={idx} className="mb-2">
                    <strong>{i.title}</strong> – Size {i.size} – SL{" "}
                    {i.quantity}
                  </div>
                ))}
              </td>

              <td className="p-3 border font-semibold">
                {o.total.toLocaleString()} đ
              </td>

              <td className="p-3 border">
                {o.cancelledAt
                  ? new Date(o.cancelledAt).toLocaleString("vi-VN")
                  : "Không xác định"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <p className="text-center mt-4 text-gray-500">
          Không có đơn hàng đã hủy
        </p>
      )}
    </div>
  );
}

export default CancelledOrder;
