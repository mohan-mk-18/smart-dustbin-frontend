import { useState, useEffect } from "react";
import AdminLayout from "../components/Layout/AdminLayout";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);

  /* ==============================
     FETCH COMPLAINTS
  ============================== */
  const fetchComplaints = () => {
    fetch("https://smart-dustbin-backend.onrender.com/complaints")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(data);
      })
      .catch((err) => console.error("Error fetching complaints:", err));
  };

  /* ==============================
     AUTO REFRESH EVERY 10 SECONDS
  ============================== */
  useEffect(() => {
    fetchComplaints();

    const interval = setInterval(() => {
      fetchComplaints();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  /* ==============================
     CLEAR COMPLAINT
  ============================== */
  const clearComplaint = async (id) => {
    try {
      await fetch(
        `https://smart-dustbin-backend.onrender.com/complaints/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "cleared" }),
        }
      );

      fetchComplaints();
    } catch (error) {
      console.error("Error clearing complaint:", error);
    }
  };

  /* ==============================
     COUNT PENDING
  ============================== */
  const pendingCount = complaints.filter(
    (c) => c.status === "pending"
  ).length;

  return (
    <AdminLayout pendingCount={pendingCount}>
      <h2 className="text-3xl font-bold text-green-700 mb-10">
        Complaints Management
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {complaints.map((complaint) => (
          <div
            key={complaint._id}
            className={`backdrop-blur-xl bg-white/70 border p-6 rounded-2xl shadow-lg
              ${
                complaint.status === "pending"
                  ? "border-red-400"
                  : "border-green-300 opacity-70"
              }`}
          >
            <h3 className="text-lg font-semibold text-green-700">
              {complaint.name}
            </h3>

            <p className="text-sm text-gray-500">
              {complaint.location}
            </p>

            {/* Complaint Message */}
            <p className="mt-3 text-gray-700">
              {complaint.message}
            </p>

            {/* Complaint Image */}
            {complaint.image && (
              <img
                src={complaint.image}
                alt="Complaint"
                className="mt-3 rounded-lg max-h-40 border shadow"
              />
            )}

            {/* Timestamp Badge */}
            <p className="text-xs text-gray-500 mt-3 bg-gray-100 inline-block px-2 py-1 rounded-lg">
              📅 {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })} •{" "}
              {new Date(complaint.createdAt).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>

            {complaint.status === "pending" && (
              <button
                onClick={() => clearComplaint(complaint._id)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl transition"
              >
                Mark as Cleared
              </button>
            )}

            <span
              className={`mt-4 inline-block ml-4 px-3 py-1 text-sm rounded-full ${
                complaint.status === "pending"
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {complaint.status}
            </span>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}