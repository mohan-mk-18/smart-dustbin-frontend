import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminLayout({ children, pendingCount }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [livePending, setLivePending] = useState(pendingCount || 0);

  const isActive = (path) =>
    location.pathname === path
      ? "text-green-900 font-bold"
      : "text-green-700";

  /* ==============================
     FETCH PENDING COUNT
  ============================== */
  const fetchPending = () => {
    fetch("https://smart-dustbin-backend.onrender.com/complaints")
      .then((res) => res.json())
      .then((data) => {
        const count = data.filter((c) => c.status === "pending").length;
        setLivePending(count);
      })
      .catch((err) => console.error("Error fetching complaints:", err));
  };

  /* ==============================
     AUTO REFRESH EVERY 10s
  ============================== */
  useEffect(() => {
    fetchPending();

    const interval = setInterval(() => {
      fetchPending();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* If page passes pendingCount prop, update state */
  useEffect(() => {
    if (pendingCount !== undefined) {
      setLivePending(pendingCount);
    }
  }, [pendingCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100">

      {/* NAVBAR */}
      <div className="flex justify-between items-center bg-white shadow-md px-8 py-4">

        <h1 className="text-2xl font-bold text-green-700">
          Smart Hygiene Admin
        </h1>

        <div className="flex items-center gap-8 relative">

          <button
            onClick={() => navigate("/admin/home")}
            className={`${isActive("/admin/home")} hover:text-green-900 transition`}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/admin/workers")}
            className={`${isActive("/admin/workers")} hover:text-green-900 transition`}
          >
            Workers
          </button>

          <button
            onClick={() => navigate("/admin/complaints")}
            className={`${isActive("/admin/complaints")} hover:text-green-900 transition relative`}
          >
            Complaints

            {livePending > 0 && (
              <span className="absolute -top-2 -right-4 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                {livePending}
              </span>
            )}
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Logout
          </button>

        </div>
      </div>

      {/* PAGE CONTENT */}
      <div className="p-10">
        {children}
      </div>

    </div>
  );
}