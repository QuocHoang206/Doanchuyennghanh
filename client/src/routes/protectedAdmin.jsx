import { Navigate } from "react-router-dom";

export default function ProtectedAdmin({ children }) {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role !== "admin" && payload.role !== "superadmin") {
      return <Navigate to="/" />;
    }

    return children;
  } catch {
    return <Navigate to="/login" />;
  }
}
