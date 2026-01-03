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

  /* ================= CART ================= */
  const getCartKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_user_${user._id}` : null;
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const key = getCartKey();
    const data = JSON.parse(localStorage.getItem(key)) || [];

    if (data.length === 0) {
      navigate("/cart");
      return;
    }

    setCart(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ================= TOTAL ================= */
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  /* ================= ORDER ================= */
  const handleOrder = async () => {
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
      await postApi.createOrder({
        name: firstName + " " + lastName,
        email,
        address,
        district,
        ward,
        paymentMethod: payment,
        items, // ✅ QUAN TRỌNG
      });

      // clear cart
      const key = getCartKey();
      localStorage.removeItem(key);

      alert("🎉 Đặt hàng thành công!");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert("Lỗi đặt hàng!");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* FORM */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Thông tin giao hàng</h2>

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

        <h3 className="font-semibold mt-4 mb-2">Thanh toán</h3>

        <label className="flex items-center gap-2 mb-2">
          <input
            type="radio"
            checked={payment === "cod"}
            onChange={() => setPayment("cod")}
          />
          Thanh toán khi nhận hàng
        </label>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="radio"
            checked={payment === "qr"}
            onChange={() => setPayment("qr")}
          />
          Chuyển khoản QR
        </label>

        <button
          onClick={handleOrder}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800"
        >
          Đặt hàng
        </button>
      </div>

      {/* SUMMARY */}
      <div className="bg-white p-6 rounded shadow h-fit">
        <h2 className="text-2xl font-semibold mb-4">Đơn hàng</h2>

        {cart.map((item, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>
              {item.title} ({item.size || "-"}) × {item.quantity}
            </span>
            <span>{(item.price * item.quantity).toLocaleString()} đ</span>
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
