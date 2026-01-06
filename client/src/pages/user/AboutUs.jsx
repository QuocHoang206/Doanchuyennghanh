function AboutUs() {
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-10">
          📜 Chính Sách của QHSHOP
        </h1>

        {/* 1 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold border-l-4 border-blue-500 pl-3 mb-3">
            1. Chính sách chung
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Website được xây dựng nhằm cung cấp các sản phẩm giày bóng rổ chính
            hãng phục vụ nhu cầu tập luyện, thi đấu và sinh hoạt thể thao.
          </p>
          <p className="text-gray-700 leading-relaxed mt-2">
            Khi truy cập và sử dụng website, khách hàng được xem như đã đồng ý
            với toàn bộ các điều khoản và chính sách được công bố.
          </p>
        </section>

        {/* 2 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold border-l-4 border-blue-500 pl-3 mb-3">
            2. Chính sách sản phẩm
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Thông tin sản phẩm gồm: tên, hình ảnh, size, màu sắc, giá bán.</li>
            <li>Hình ảnh mang tính minh họa, có thể chênh lệch nhẹ.</li>
            <li>Cam kết không kinh doanh hàng giả, hàng nhái.</li>
          </ul>
        </section>

        {/* 3 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold border-l-4 border-blue-500 pl-3 mb-3">
            3. Chính sách giá & thanh toán
          </h2>

          <h3 className="font-medium mt-3 mb-2">3.1 Giá bán</h3>
          <p className="text-gray-700 leading-relaxed">
            Giá sản phẩm được niêm yết rõ ràng và đã bao gồm thuế (nếu có).
          </p>

          <h3 className="font-medium mt-4 mb-2">3.2 Hình thức thanh toán</h3>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Thanh toán khi nhận hàng (COD)</li>
            <li>Chuyển khoản ngân hàng</li>
            <li>Thanh toán điện tử</li>
          </ul>
        </section>

        {/* 4 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold border-l-4 border-blue-500 pl-3 mb-3">
            4. Chính sách giao hàng
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Nội thành: 1–3 ngày làm việc</li>
            <li>Ngoại thành/tỉnh: 3–7 ngày làm việc</li>
          </ul>
        </section>

        {/* 5 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold border-l-4 border-blue-500 pl-3 mb-3">
            5. Chính sách đổi trả
          </h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Đổi trả trong vòng 7 ngày kể từ khi nhận hàng</li>
            <li>Sản phẩm còn nguyên tem, chưa qua sử dụng</li>
            <li>Không áp dụng cho lỗi do người dùng</li>
          </ul>
        </section>

        {/* 6 */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold border-l-4 border-blue-500 pl-3 mb-3">
            6. Bảo mật thông tin
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Website cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng
            và không chia sẻ cho bên thứ ba khi chưa có sự đồng ý.
          </p>
        </section>

        {/* 7 */}
        <section>
          <h2 className="text-xl font-semibold border-l-4 border-blue-500 pl-3 mb-3">
            7. Thông tin liên hệ
          </h2>
          <p className="text-gray-700">
            📧 Email: <b>supportQH@gmail.com</b>
          </p>
          <p className="text-gray-700">
            ☎ Hotline: <b>0865136752</b>
          </p>
          <p className="text-gray-700">
            ⏰ Giờ làm việc: 8h00 – 21h00 (Thứ 2 – Chủ nhật)
          </p>
        </section>
      </div>
    </div>
  );
}

export default AboutUs;
