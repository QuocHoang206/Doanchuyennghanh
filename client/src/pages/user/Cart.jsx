import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);

  const getCartKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return null;
    return `cart_user_${user._id}`;
  };
  const getBuyNowKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `buy_now_cart_${user._id}` : null;
  };

  const getUserCart = () => {
    const key = getCartKey();
    if (!key) return [];
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  const saveUserCart = (cartData) => {
    const key = getCartKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cartData));
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    setCart(getUserCart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const updateQuantity = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;

    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }

    setCart(newCart);
    saveUserCart(newCart);
  };


  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-xl">🛒 Giỏ hàng trống</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      {cart.map((item, i) => (
        <div key={i} className="flex gap-4 items-center border-b py-4">
          <img
            src={item.image}
            alt={item.title}
            className="w-24 h-24 object-cover rounded"
          />

          <div className="flex-1">
            <h3 className="font-semibold">{item.title}</h3>
            <p>Size: {item.size || "-"}</p>
            <p className="text-red-600 font-bold">
              {item.price.toLocaleString()} đ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(i, -1)}
              className="px-3 py-1 border rounded"
            >
              -
            </button>

            <span>{item.quantity}</span>

            <button
              onClick={() => updateQuantity(i, 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="text-right mt-6 text-xl font-bold">
        Tổng: {total.toLocaleString()} đ
      </div>
      <button
        onClick={() => {
          const buyNowKey = getBuyNowKey();
          if (buyNowKey) {
            localStorage.removeItem(buyNowKey);
          }
          navigate("/pay");
        }}
        className="mt-4 w-full py-3 rounded-lg text-white text-lg bg-green-600 hover:bg-green-700"
      >
        Thanh toán
      </button>
    </div>
  );
}

export default Cart;
