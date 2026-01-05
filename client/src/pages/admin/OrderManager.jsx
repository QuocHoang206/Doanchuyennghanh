import { useEffect, useState } from "react";
import postApi from "../../services/postService";

function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  // 🔽 THÊM CHO SHIPPER
  const [showShipModal, setShowShipModal] = useState(false);
  const [shipper, setShipper] = useState("");

  const [searchEmail, setSearchEmail] = useState("");

  const loadOrders = () => {
    postApi
      .getAllOrders()
      .then((res) => setOrders(res.data.data))
      .catch(console.log);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  /* ================= HỦY ĐƠN (GIỮ NGUYÊN) ================= */
  const handleCancel = async (id) => {
    if (!confirm("Bạn có chắc muốn hủy đơn này?")) return;
    await postApi.cancelOrder(id);
    loadOrders();
  };

  /* ================= CHỌN SHIPPER ================= */
  const confirmShip = async () => {
    if (!shipper) {
      alert("Vui lòng chọn đơn vị vận chuyển");
      return;
    }

    await postApi.assignShipper(selectedOrder._id, {
      ship: shipper,
    });

    setShowShipModal(false);
    setSelectedOrder(null);
    setShipper("");
    loadOrders();
  };

  /* ================= HOÀN THÀNH ================= */
  const completeOrder = async (id) => {
    if (!confirm("Xác nhận đơn hàng đã giao xong?")) return;
    await postApi.completeOrder(id);
    loadOrders();
  };

  const filteredOrders = orders.filter((o) =>
    o.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Quản lý đơn hàng
      </h1>

      {/* SEARCH */}
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          placeholder="🔍 Tìm theo email..."
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
          className="border px-4 py-2 rounded w-80"
        />
      </div>

      <table className="w-full border bg-white shadow">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="p-3 border">Khách hàng</th>
            <th className="p-3 border">Tổng tiền</th>
            <th className="p-3 border">Vận chuyển</th>
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

              <td className="p-3 border font-semibold">
                {o.total.toLocaleString()} đ
              </td>

              <td className="p-3 border">
                {o.ship ? o.ship.toUpperCase() : "-"}
              </td>

              <td className="p-3 border font-semibold">{o.status}</td>

              <td className="p-3 border space-y-2">
                {/* XEM CHI TIẾT */}
                <button
                  onClick={() => {
                    setSelectedOrder(o);
                    setShowDetail(true);
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded w-full"
                >
                  Xem chi tiết
                </button>

                {/* CHỜ XÁC NHẬN → CHỌN SHIPPER */}
                {o.status === "Chờ xác nhận" && (
                  <>
                    <button
                      onClick={() => {
                        setSelectedOrder(o);
                        setShowShipModal(true);
                      }}
                      className="px-3 py-1 bg-yellow-500 text-white rounded w-full"
                    >
                      Xác nhận & giao
                    </button>

                    {/* 🔴 GIỮ NÚT HỦY */}
                    <button
                      onClick={() => handleCancel(o._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded w-full"
                    >
                      Hủy đơn
                    </button>
                  </>
                )}

                {/* ĐANG GIAO */}
                {o.status === "Đang giao" && (
                  <button
                    onClick={() => completeOrder(o._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded w-full"
                  >
                    Hoàn thành
                  </button>
                )}

                {o.status === "Hoàn thành" && (
                  <span className="text-green-600 font-semibold text-sm">
                    ✔ Đã hoàn thành
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL CHỌN SHIPPER ================= */}
      {showShipModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-80">
            <h3 className="text-lg font-bold mb-4">
              Chọn đơn vị vận chuyển
            </h3>

            <label className="flex gap-2 mb-2">
              <input
                type="radio"
                value="grab"
                checked={shipper === "grab"}
                onChange={(e) => setShipper(e.target.value)}
              />
              Grab
            </label>

            <label className="flex gap-2 mb-4">
              <input
                type="radio"
                value="be"
                checked={shipper === "be"}
                onChange={(e) => setShipper(e.target.value)}
              />
              Be
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowShipModal(false)}
                className="border px-3 py-1 rounded"
              >
                Hủy
              </button>
              <button
                onClick={confirmShip}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                Xác nhận giao
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= MODAL XEM CHI TIẾT ĐƠN ================= */}
{showDetail && selectedOrder && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4 text-blue-600">
        Chi tiết đơn hàng
      </h3>

      <div className="mb-4">
        <p><b>Khách hàng:</b> {selectedOrder.name}</p>
        <p><b>Email:</b> {selectedOrder.email}</p>
        <p><b>Địa chỉ:</b> {selectedOrder.address}</p>
        <p><b>Trạng thái:</b> {selectedOrder.status}</p>
        <p><b>Vận chuyển:</b> {selectedOrder.ship ? selectedOrder.ship.toUpperCase() : "-"}</p>
      </div>

      <table className="w-full border mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Sản phẩm</th>
            <th className="border p-2">Size</th>
            <th className="border p-2">SL</th>
            <th className="border p-2">Giá</th>
          </tr>
        </thead>
        <tbody>
          {selectedOrder.items?.map((item, i) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{item.title}</td>
              <td className="border p-2">{item.size || "-"}</td>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">
                {item.price.toLocaleString()} đ
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right font-bold text-lg mb-4">
        Tổng tiền: {selectedOrder.total.toLocaleString()} đ
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            setShowDetail(false);
            setSelectedOrder(null);
          }}
          className="px-4 py-2 bg-gray-600 text-white rounded"
        >
          Đóng
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default OrderManager;
