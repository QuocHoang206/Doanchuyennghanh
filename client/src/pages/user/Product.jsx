import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import postApi from "../../services/postService";

const categoryMap = {
  shoes: "Giày",
  bags: "Balo",
  balls: "Bóng",
  accessories: "Phụ kiện",
};

function Product() {
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");

  const [keyword, setKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useState("");

  const categories = ["all", "Giày", "Balo", "Bóng"];
  const colors = ["all", "Đỏ", "Xanh lá", "Đen", "Trắng", "Vàng"];
  const sizes = ["all", "38", "39", "40", "41", "42", "43", "44", "45"];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("cat");

  useEffect(() => {
    if (categoryFromURL) {
      const mapped = categoryMap[categoryFromURL] || "all";
      setSelectedCategory(mapped);
    }
  }, [categoryFromURL]);

  useEffect(() => {
    postApi
      .getProducts()
      .then((res) => setProducts(res.data.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword.trim().toLowerCase());
    }, 400);

    return () => clearTimeout(timer);
  }, [keyword]);

  const filteredProducts = products
    .filter((p) =>
      debouncedKeyword === ""
        ? true
        : p.title.toLowerCase().includes(debouncedKeyword) ||
          p.color.toLowerCase().includes(debouncedKeyword)
    )
    // CATEGORY
    .filter((p) =>
      selectedCategory === "all" ? true : p.category === selectedCategory
    )
    // COLOR
    .filter((p) => (selectedColor === "all" ? true : p.color === selectedColor))
    // SIZE
    .filter((p) =>
      selectedSize === "all" ? true : p.size.includes(selectedSize)
    );

  return (
    <div className="w-full px-4 py-8 md:px-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Sản phẩm thể thao
      </h1>

      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
        
        </span>

        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Tìm kiếm sản phẩm theo tên hoặc màu..."
          className="w-full pl-12 pr-12 py-3 border rounded-full
                     shadow-sm focus:outline-none focus:ring-2
                     focus:ring-blue-500 transition"
        />

        {keyword && (
          <button
            onClick={() => setKeyword("")}
            className="absolute right-4 top-1/2 -translate-y-1/2
                       text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="border rounded-xl p-5 shadow bg-white h-fit md:col-span-1">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Bộ lọc</h2>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Danh mục</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`cursor-pointer px-3 py-2 rounded-lg transition
                    ${
                      selectedCategory === cat
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 hover:bg-blue-100"
                    }`}
                >
                  {cat === "all" ? "Tất cả" : cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Màu sắc</h3>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Size</h3>
            <select
              className="w-full p-2 border rounded-lg"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </aside>

        <main className="md:col-span-3">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item) => {
                const finalPrice =
                  item.discount > 0
                    ? item.price * (1 - item.discount / 100)
                    : item.price;

                return (
                  <div
                    key={item._id}
                    className="border rounded-xl overflow-hidden shadow
                               hover:shadow-xl transition-all bg-white
                               hover:-translate-y-1 relative"
                  >
                    {item.discount > 0 && (
                      <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded-lg">
                        -{item.discount}%
                      </span>
                    )}

                    <img
                      src={`http://localhost:3000${item.image}`}
                      className="w-full h-48 object-cover"
                      alt={item.title}
                    />

                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 text-lg line-clamp-2">
                        {item.title}
                      </h3>

                      {item.discount > 0 ? (
                        <>
                          <p className="text-red-600 font-bold mt-2">
                            {finalPrice.toLocaleString()} đ
                          </p>
                          <p className="text-gray-400 line-through text-sm">
                            {item.price.toLocaleString()} đ
                          </p>
                        </>
                      ) : (
                        <p className="text-red-600 font-bold mt-2">
                          {item.price.toLocaleString()} đ
                        </p>
                      )}

                      <Link to={`/product/${item._id}`}>
                        <button className="w-full bg-blue-600 text-white mt-3 py-2 rounded-lg hover:bg-blue-700 transition">
                          Mua ngay
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                Không tìm thấy sản phẩm phù hợp
              </p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Product;
