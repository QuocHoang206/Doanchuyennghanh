import { useEffect, useState } from "react";
import postApi from "../../services/postService";

export default function Banner() {
  const [images, setImages] = useState([]);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    postApi.getSystemSetting().then((res) => {
      const setting = res.data?.data || res.data;
      if (setting?.banner?.list?.length > 0) {
        setImages(setting.banner.list);
        setCurrent(setting.banner.activeIndex || 0);
      }
    });
  }, []);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div className="relative w-full h-[500px] overflow-hidden rounded-2xl shadow mb-14">
      {images.map((img, index) => (
        <img
          key={index}
          src={`http://localhost:3000${img}`}
          alt={`Banner ${index}`}
          className={`absolute inset-0 w-full h-full object-contain bg-black transition-opacity duration-700 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrent((prev) => (prev - 1 + images.length) % images.length)
            }
            className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/70"
          >
            ❮
          </button>

          <button
            onClick={() => setCurrent((prev) => (prev + 1) % images.length)}
            className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-2 rounded-full hover:bg-black/70"
          >
            ❯
          </button>

          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex space-x-3">
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  i === current ? "bg-white" : "bg-gray-400"
                }`}
              ></div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
