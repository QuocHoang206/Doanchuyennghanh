import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postApi from "../../services/postService";

function Pay() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");

  const [payment, setPayment] = useState("cod");

  // 🔐 QR CONTROL
  const [showQR, setShowQR] = useState(false);
  const [qrConfirmed, setQrConfirmed] = useState(false);

  /* ================= CART KEY ================= */
  const getCartKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_user_${user._id}` : null;
  };

  const getBuyNowKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `buy_now_cart_${user._id}` : null;
  };

  /* ================= LOAD CART ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const buyNowKey = getBuyNowKey();
    const normalKey = getCartKey();

    let data = [];

    if (buyNowKey && localStorage.getItem(buyNowKey)) {
      data = JSON.parse(localStorage.getItem(buyNowKey)) || [];
    } else {
      data = JSON.parse(localStorage.getItem(normalKey)) || [];
    }

    if (data.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(data);
  }, [navigate]);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================= HANDLE ORDER ================= */
  const handleOrder = async () => {
    // 🔒 BLOCK QR IF NOT CONFIRMED
    if (payment === "qr" && !qrConfirmed) {
      alert("Vui lòng quét mã QR và xác nhận thanh toán!");
      return;
    }

    if (!email || !firstName || !lastName || !address) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const items = cart.map((item) => ({
      productId: item.productId,
      title: item.title,
      image: item.image,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    }));

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      await postApi.createOrder({
        userId: user._id,
        name: firstName + " " + lastName,
        email,
        address,
        district,
        ward,
        paymentMethod: payment,
        items,
      });

      // 🧹 CLEAR CARTS
      const buyNowKey = getBuyNowKey();
      if (buyNowKey) localStorage.removeItem(buyNowKey);

      const cartKey = getCartKey();
      if (cartKey) localStorage.removeItem(cartKey);

      alert("🎉 Đặt hàng thành công!");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Lỗi đặt hàng!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* ================= LEFT ================= */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">
          Thông tin giao hàng
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4 mb-3">
          <input
            type="text"
            placeholder="Tên"
            className="border p-3 rounded"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Họ"
            className="border p-3 rounded"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <input
          type="text"
          placeholder="Địa chỉ"
          className="border p-3 rounded w-full mb-3"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4 mb-3">
          <input
            type="text"
            placeholder="Quận / Huyện"
            className="border p-3 rounded"
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
          />
          <input
            type="text"
            placeholder="Phường / Xã"
            className="border p-3 rounded"
            value={ward}
            onChange={(e) => setWard(e.target.value)}
          />
        </div>

        <h3 className="font-semibold mt-4 mb-2">
          Phương thức thanh toán
        </h3>

        {/* COD */}
        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            checked={payment === "cod"}
            onChange={() => {
              setPayment("cod");
              setShowQR(false);
              setQrConfirmed(false);
            }}
          />
          Thanh toán khi nhận hàng
        </label>

        {/* QR */}
        <label className="flex items-center gap-2 mb-4">
          <input
            type="radio"
            checked={payment === "qr"}
            onChange={() => {
              setPayment("qr");
              setShowQR(true);
              setQrConfirmed(false);
            }}
          />
          Chuyển khoản QR
        </label>

        {/* ================= QR BLOCK ================= */}
        {payment === "qr" && showQR && (
          <div className="border rounded p-4 mb-4 text-center">
            <h4 className="font-semibold mb-2">
              Quét mã QR để thanh toán
            </h4>

            {/* 👉 Đặt ảnh QR của bạn trong public/qr-demo.png */}
            <img
              src="/public/momo.jpg"
              alt="QR thanh toán"
              className="mx-auto w-48 h-48"
            />

            <p className="text-sm text-gray-600 mt-2">
              Nội dung chuyển khoản:{" "}
              <b>SPORTSHOP</b>
            </p>

            {!qrConfirmed ? (
              <button
                onClick={() => setQrConfirmed(true)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
              >
                Tôi đã thanh toán
              </button>
            ) : (
              <p className="mt-3 text-green-600 font-semibold">
                ✔ Đã xác nhận thanh toán
              </p>
            )}
          </div>
        )}

        {/* ================= ORDER BUTTON ================= */}
        <button
          disabled={payment === "qr" && !qrConfirmed}
          onClick={handleOrder}
          className={`w-full py-3 rounded text-white ${
            payment === "qr" && !qrConfirmed
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
          Đặt hàng
        </button>
      </div>

      {/* ================= RIGHT ================= */}
      <div className="bg-white p-6 rounded shadow h-fit">
        <h2 className="text-2xl font-semibold mb-4">Đơn hàng</h2>

        {cart.map((item, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>
              {item.title} ({item.size || "-"}) × {item.quantity}
            </span>
            <span>
              {(item.price * item.quantity).toLocaleString()} đ
            </span>
          </div>
        ))}

        <div className="border-t my-3"></div>

        <div className="text-xl font-bold text-right">
          Tổng: {total.toLocaleString()} đ
        </div>
      </div>
    </div>
  );
}

export default Pay;
