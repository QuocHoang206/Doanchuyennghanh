import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import authApi from "../../services/authService.js";


function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const res = await authApi.login(form);

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        
        alert("Login successful!");

        const redirectTo = location.state?.redirectTo;

        if (res.data.user.role === "admin" || res.data.user.role === "superadmin") {
          navigate("/admin");
        } else if (redirectTo) {
          navigate(redirectTo, { replace: true });
        } else {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        setErr(error.response?.data?.message || "Login failed");
      }
    };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">
          Login to SPORTSHOP
        </h2>

        {err && (
          <p className="text-red-600 mb-4 text-center font-medium">{err}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-600"
              required
            />

            <div className="mt-2">
              <input
                type="checkbox"
                onChange={() => setShowPassword(!showPassword)}
              />{" "}
              Show Password
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
          >
            Login
          </button>

          <Link
            to="/register"
            className="text-blue-600 hover:underline block text-center mt-4"
          >
            Tạo tài khoản
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
