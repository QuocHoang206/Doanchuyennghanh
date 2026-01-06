import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Header1() {
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token && user?.role === "admin") {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setRole(null);
    setUser(null);
    navigate("/login");
  }
}, []);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setRole(payload.role);

        const u = JSON.parse(localStorage.getItem("user"));
        setUser(u);
      } catch {
        localStorage.removeItem("token");
        setRole(null);
        setUser(null);
      }
    } else {
      setRole(null);
      setUser(null);
    }
  }, [token]);

 
  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const cartKey = `cart_user_${user._id}`;

    const loadCart = () => {
      const cart = JSON.parse(localStorage.getItem(cartKey)) || [];
      const total = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(total);
    };

    loadCart();

  
    window.addEventListener("storage", loadCart);
    return () => window.removeEventListener("storage", loadCart);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setRole(null);
    setUser(null);
    setCartCount(0);
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md relative">
      <div className="flex items-center justify-between px-6 py-3">

        <Link to="/" className="text-2xl font-bold text-blue-800">
          QHSHOP
        </Link>

     
        <nav className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <Link to="/" className="hover:text-blue-700">
            Trang chính
          </Link>
          <Link to="/product" className="hover:text-blue-700">
            Sản Phẩm
          </Link>
          <Link to="/blackfriday" className="hover:text-blue-700">
            Black Friday
          </Link>
          <Link to="/aboutus" className="hover:text-blue-700">
            Về chúng tôi
          </Link>
        </nav>

        
        <div className="flex items-center gap-6 relative">
         
          {token && role !== "admin" && (
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-gray-700 hover:text-blue-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6h13M7 13L5.4 5M10 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
                />
              </svg>

              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 bg-red-600 text-white
                             text-xs w-5 h-5 rounded-full flex items-center
                             justify-center"
                >
                  {cartCount}
                </span>
              )}
            </div>
          )}

         





          {!token ? (
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
            >
              Login
            </button>
          ) : (
            <div className="relative">
              <div
                onClick={() => setOpenProfile(!openProfile)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="font-medium text-gray-700">
                  {user?.name || "User"}
                </span>
              </div>

              {openProfile && (
                <div className="absolute right-0 mt-3 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <Link
                    to={`/profile/${user?._id}`}
                    onClick={() => setOpenProfile(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Thông tin cá nhân
                  </Link>
                  {role !== "admin" && (
                    <Link
                      to="/order"
                      onClick={() => setOpenProfile(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Đơn hàng của tôi
                    </Link>
                  )}

                  {role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setOpenProfile(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header1;
