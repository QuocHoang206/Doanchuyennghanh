import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import postApi from "../../services/postService";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);

  useEffect(() => {
  const fetchOrder = async () => {
    try {
      const res = await postApi.getAllOrders();
      const orders = res.data?.data || [];

      const found = orders.find(
        (o) => String(o._id) === String(id)
      );

      if (!found) {
        alert("Không tìm thấy đơn");
        navigate("/order");
        return;
      }

      setOrder(found);
    } catch (err) {
      console.log(err);
      alert("Lỗi tải đơn hàng");
    }
  };

  fetchOrder();
}, [id]);


  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-5">
        Chi tiết đơn hàng
      </h1>

      <div className="bg-white p-5 rounded shadow mb-6">
        <p><b>Mã đơn:</b> {order._id}</p>
        <p><b>Trạng thái:</b> {order.status}</p>
        <p><b>Địa chỉ:</b> {order.address}</p>
        <p><b>Thanh toán:</b> {order.paymentMethod}</p>
      </div>

      <div className="bg-white p-5 rounded shadow">
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex justify-between border-b py-2"
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

        <div className="text-right font-bold text-lg mt-4">
          Tổng tiền: {order.total.toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
