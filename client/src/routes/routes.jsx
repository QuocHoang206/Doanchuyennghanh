import { createBrowserRouter } from "react-router-dom";
import Default from "../layouts/Default.jsx";
import Home from "../pages/user/Home.jsx";
import ProductDetail from "../pages/user/ProductDetail.jsx";
import NotFound from "../pages/Notfound.jsx";
import Login from "../pages/user/Login.jsx";
import Product from "../pages/user/Product.jsx";
import Register from "../pages/user/Register.jsx";
import ProtectedAdmin from "../routes/protectedAdmin.jsx";
import AdminDashboard from "../pages/admin/AdminDashboard.jsx";
import AboutUs from "../pages/user/AboutUs.jsx";
import ProductManager from "../pages/admin/ProductManager.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import Pay from "../pages/user/Pay.jsx";
import OrderManager from "../pages/admin/OrderManager.jsx";
import UserManager from "../pages/admin/UserManager.jsx";
import SystemSetting from "../pages/admin/SystemSetting.jsx";
import CancelOrder from "../pages/admin/CancelOrder.jsx";
import ProtectedPay from "./protectedPay.jsx";
import Profile from "../pages/user/Profile.jsx";
import Cart from "../pages/user/Cart.jsx";
import Blackfriday from "../pages/user/Backfriday.jsx";
import OrderDetail from "../pages/user/Orderdetail.jsx";
import OrderList from "../pages/user/Orderlist.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Default />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "product", element: <Product /> },
      { path: "product/:id", element: <ProductDetail /> },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "aboutus",
        element: <AboutUs />,
      },
      {
        path: "profile/:id",
        element: <Profile />,
      },
      {
        element: <ProtectedPay />,
        children: [
          {
            path: "pay",
            element: <Pay />,
          },
        ],
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "blackfriday",
        element: <Blackfriday />,
      },
      {
        path: "order",
        element: <OrderList />,
      },
      {
        path: "order/:id",
        element: <OrderDetail />,
      },
    ],
  },

  {
    path: "/admin",
    element: (
      <ProtectedAdmin>
        <AdminLayout />
      </ProtectedAdmin>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "productmanager",
        element: <ProductManager />,
      },
      {
        path: "ordermanager",
        element: <OrderManager />,
      },
      {
        path: "usermanager",
        element: <UserManager />,
      },
      {
        path: "systemsetting",
        element: <SystemSetting />,
      },
      {
        path: "canceledorders",
        element: <CancelOrder />,
      },
    ],
  },
]);
