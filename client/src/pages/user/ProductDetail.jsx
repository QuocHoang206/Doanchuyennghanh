import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import postApi from "../../services/postService";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    postApi
      .readProduct(id)
      .then((res) => {
        const p = res.data?.data || {};

        p.size = Array.isArray(p.size)
          ? p.size
          : typeof p.size === "string"
          ? p.size
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];

        setProduct(p);
      })
      .catch(() => setProduct(null));
  }, [id]);

  useEffect(() => {
    postApi.getCommentsByProduct(id).then((res) => {
      setComments(res.data.data || []);
    });
  }, [id]);

  if (!product) return <p className="p-6">Đang tải...</p>;

  const sizes = product.size || [];

  const getCartKey = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? `cart_user_${user._id}` : null;
  };

  const getUserCart = () => {
    const key = getCartKey();
    if (!key) return [];
    return JSON.parse(localStorage.getItem(key)) || [];
  };

  const saveUserCart = (cart) => {
    const key = getCartKey();
    if (!key) return;
    localStorage.setItem(key, JSON.stringify(cart));
  };

  const handleAddToCart = () => {
  if (sizes.length > 0 && !selectedSize) {
    alert("Vui lòng chọn size!");
    return;
  }

  if (user?.role === "admin") {
    alert("Admin không được phép mua hàng");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const cart = getUserCart();

  const index = cart.findIndex(
    (item) =>
      item.productId === product._id &&
      item.size === (selectedSize || null)
  );

  if (index !== -1) {
    cart[index].quantity += quantity;
  } else {
    cart.push({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize || null,
      quantity,
    });
  }

  saveUserCart(cart);

  // 🔥 BẮT BUỘC – cập nhật header ngay
  window.dispatchEvent(new Event("cart-updated"));

  alert("Đã thêm vào giỏ hàng");
};

 const handleBuyNow = () => {
  if (sizes.length > 0 && !selectedSize) {
    alert("Vui lòng chọn size!");
    return;
  }

  if (user?.role === "admin") {
    alert("Admin không được phép mua hàng");
    return;
  }

  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }

  const buyNowKey = `buy_now_cart_${user._id}`;

  const buyNowCart = [
    {
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.image,
      size: selectedSize || null,
      quantity,
    },
  ];

  localStorage.setItem(buyNowKey, JSON.stringify(buyNowCart));
  navigate("/pay");
};

  const handleSubmitComment = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Vui lòng đăng nhập để bình luận");
      return;
    }

    if (!commentText.trim()) return;

    const res = await postApi.createComment({
      productId: product._id,
      content: commentText,
    });

    setComments((prev) => [res.data.data, ...prev]);

    setCommentText("");
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <img
            
              src={product.image || "/no-img.png"}
            
            alt={product.title}
            className="w-full h-96 object-cover rounded-xl"
          />
        </div>

        <div>
          <h1 className="text-4xl font-bold">{product.title}</h1>

          <p className="text-2xl text-red-600 font-semibold mt-3">
            {(product.price ?? 0).toLocaleString()} đ
          </p>

          <h3 className="mt-5 text-lg font-semibold">Chọn size:</h3>
          <div className="flex gap-3 flex-wrap mt-2">
            {sizes.length > 0 ? (
              sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-4 py-2 rounded border ${
                    selectedSize === sz
                      ? "bg-black text-white"
                      : "bg-white border-gray-400 hover:bg-gray-200"
                  }`}
                >
                  {sz}
                </button>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Sản phẩm không có size</p>
            )}
          </div>

          <p className="mt-4">
            <strong>Mô tả:</strong> {product.description || "-"}
          </p>
          <div className="flex items-center gap-4 mt-6">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-4 py-2 border rounded"
            >
              -
            </button>

            <span className="text-lg font-semibold">{quantity}</span>

            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-4 py-2 border rounded"
            >
              +
            </button>
          </div>

          {user?.role !== "admin" && (
  <button
    onClick={handleAddToCart}
    className="w-full mt-4 py-3 rounded-lg text-white text-lg bg-blue-600 hover:bg-blue-700"
  >
    Thêm vào giỏ
  </button>
)}

          <button
            onClick={handleBuyNow}
            className="w-full mt-4 py-3 rounded-lg text-white text-lg bg-green-600 hover:bg-green-700"
          >
            Mua ngay
          </button>
        </div>
      </div>

      <div className="mt-14 max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Bình luận</h2>

        <textarea
          rows={3}
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Viết bình luận của bạn..."
          className="w-full border rounded p-3"
        />

        <button
          onClick={handleSubmitComment}
          className="mt-3 px-6 py-2 bg-black text-white rounded"
        >
          Gửi bình luận
        </button>

        <div className="mt-6 space-y-4">
          {comments.length === 0 && (
            <p className="text-gray-500">Chưa có bình luận</p>
          )}

          {comments.map((c) => (
            <div key={c._id} className="border rounded p-4">
              <p className="font-semibold">{c.username}</p>
              <p className="text-gray-500 text-sm">
                {new Date(c.createdAt).toLocaleString()}
              </p>
              <p className="mt-2">{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
