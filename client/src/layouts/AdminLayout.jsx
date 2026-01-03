import { Outlet, Link } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* FIXED SIDEBAR */}
      <aside className="w-64 bg-white shadow-md p-6 fixed top-0 left-0 h-full z-50">
        <h2 className="text-2xl font-bold text-blue-700 mb-6">Admin Page</h2>

        <nav className="space-y-4 text-gray-700">
          <Link to="/admin" className="block hover:text-blue-600">Dashboard</Link>
          <Link to="/admin/productmanager" className="block hover:text-blue-600">Quản lý sản phẩm</Link>
          <Link to="/admin/ordermanager" className="block hover:text-blue-600">Quản lý đơn hàng</Link>
          <Link to="/admin/canceledorders" className="block hover:text-blue-600">Đơn hàng đã hủy</Link>
          <Link to="/admin/usermanager" className="block hover:text-blue-600">Quản lý người dùng</Link>
          <Link to="/admin/systemsetting" className="block hover:text-blue-600">Cài đặt hệ thống</Link>
          <hr className="my-4 border-gray-300" />
          <Link to="/" className="block hover:text-blue-600">Trang chủ</Link>
        </nav>
      </aside>

       
      <main className="flex-1 p-8 ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
