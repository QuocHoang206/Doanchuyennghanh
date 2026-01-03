import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch {
      console.log("Invalid token");
    }
  }

  const handleGoBack = () => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-gray-800 px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-gray-600 mb-8 text-center">
        The page you're looking for doesn't exist.
        <br />
        Please try again.
      </p>

      <button
        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium shadow hover:bg-blue-700 hover:scale-105 transform transition duration-200"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
}

export default NotFound;
