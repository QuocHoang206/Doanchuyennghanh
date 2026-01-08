import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postApi from "../../services/postService";
import Banner from "../../components/common/Banner";

function Home() {
  const [products, setProducts] = useState([]);
  const [setting, setSetting] = useState(null);
  const navigate = useNavigate();

  const categoryMap = {
    shoes: "Giày",
    balls: "Bóng",
    bags: "Balo",
  };

  const isDiscountActive = () => {
    if (!setting?.discount?.enabled) return false;
    const now = new Date();
    return (
      now >= new Date(setting.discount.startAt) &&
      now <= new Date(setting.discount.endAt)
    );
  };

  useEffect(() => {
    postApi.getProducts().then((res) => {
      setProducts(res.data.data);
    });
  }, []);

  useEffect(() => {
    postApi.getSystemSetting().then((res) => {
      setSetting(res.data?.data || res.data);
    });
  }, []);

  const getFinalPrice = (p) => {
    if (isDiscountActive() && p.discount > 0) {
      return Math.round((p.price * (100 - p.discount)) / 100);
    }
    return p.price;
  };

  const filterSaleByCategory = (cat) => {
    const mapped = categoryMap[cat];
    const discountActive = isDiscountActive();

    return products.filter((p) => {
      if (p.category?.toLowerCase() !== mapped.toLowerCase()) return false;

      if (discountActive) {
        return p.discount > 0;
      }

      return !p.discount || p.discount === 0;
    });
  };

  const renderSection = (title, key) => {
    const list = filterSaleByCategory(key);

    return (
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">{title}</h2>
          <button
            onClick={() => navigate("/product")}
            className="px-4 py-2 bg-black text-white rounded"
          >
            Xem thêm →
          </button>
        </div>

        {list.length === 0 ? (
          <p className="text-gray-500">Không có sản phẩm</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {list.map((p) => (
              <div
                key={p._id}
                onClick={() => navigate(`/product/${p._id}`)}
                className="bg-white rounded-xl shadow hover:shadow-xl transition cursor-pointer relative"
              >
                {isDiscountActive() && p.discount > 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{p.discount}%
                  </span>
                )}

                <img
                  src={p.image}
                  alt={p.title}
                  className="w-full h-56 object-cover rounded-t-xl"
                />

                <div className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2">
                    {p.title}
                  </h3>

                  <div className="mt-2">
                    {isDiscountActive() && p.discount > 0 ? (
                      <>
                        <span className="text-red-600 font-bold text-xl">
                          {getFinalPrice(p).toLocaleString()} đ
                        </span>
                        <span className="ml-2 text-gray-500 line-through">
                          {p.price.toLocaleString()} đ
                        </span>
                      </>
                    ) : (
                      <span className="text-red-600 font-bold text-xl">
                        {p.price.toLocaleString()} đ
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Banner />

      <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10">
        Sản phẩm nổi bật
      </h1>

      {renderSection("Giày", "shoes")}
      {renderSection("Bóng", "balls")}
      {renderSection("Balo", "bags")}
    </div>
  );
}

export default Home;
