import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage({ onLogin }) {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    id: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!credentials.id || !credentials.password) {
      alert("Please enter Admin ID and Password");
      return;
    }

    // Temporary authentication
    if (credentials.id === "admin" && credentials.password === "1234") {
      onLogin();
      navigate("/admin/home");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-green-200 px-4">

      {/* Glass Card */}
      <div className="backdrop-blur-xl bg-white/60 border border-green-200 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        <h2 className="text-3xl font-extrabold text-green-700 text-center mb-2">
          Admin Control Panel
        </h2>

        <p className="text-center text-gray-600 mb-8">
          Smart Hygiene Management System
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="id"
            placeholder="Admin ID"
            value={credentials.id}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={credentials.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/80"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition duration-300 shadow-lg active:scale-95"
          >
            Login
          </button>

        </form>

      </div>
    </div>
  );
}