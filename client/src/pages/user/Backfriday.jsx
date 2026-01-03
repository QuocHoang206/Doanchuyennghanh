import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import postApi from "../../services/postService";
import Countdown from "../../components/common/Countdown";

function Blackfriday() {
  const [products, setProducts] = useState([]);
  const [setting, setSetting] = useState(null);
  const navigate = useNavigate();

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
      setProducts(res.data.data.filter((p) => p.discount > 0));
    });
    postApi.getSystemSetting().then((res) => {
      setSetting(res.data.data);
    });
  }, []);

  if (setting && !isDiscountActive()) {
    return (
      <div className="p-10 text-center text-gray-500">
        Chương trình Black Friday hiện chưa diễn ra
      </div>
    );
  }

  const getFinalPrice = (p) =>
    Math.round((p.price * (100 - p.discount)) / 100);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-black text-white rounded-xl p-8 mb-6 text-center">
        <h1 className="text-4xl font-extrabold text-red-500">
          🔥 BLACK FRIDAY SALE 🔥
        </h1>

        {setting?.discount?.endAt && (
          <div className="mt-4">
            <Countdown endAt={setting.discount.endAt} />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <div
            key={p._id}
            onClick={() => navigate(`/product/${p._id}`)}
            className="bg-white rounded-xl shadow cursor-pointer"
          >
            <img
              src={`http://localhost:3000${p.image}`}
              className="h-56 w-full object-cover rounded-t-xl"
            />
            <div className="p-4">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-red-600 font-bold">
                {getFinalPrice(p).toLocaleString()} đ
              </p>
              <p className="line-through text-gray-500">
                {p.price.toLocaleString()} đ
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Blackfriday;
