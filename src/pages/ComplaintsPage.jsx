import { useState, useEffect } from "react";
import AdminLayout from "../components/Layout/AdminLayout";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

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
     AUTO REFRESH
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
            onClick={() => setSelectedComplaint(complaint)}
            className={`cursor-pointer backdrop-blur-xl bg-white/70 border p-6 rounded-2xl shadow-lg
              ${
                complaint.status === "pending"
                  ? "border-red-400"
                  : "border-green-300 opacity-70"
              }`}
          >
            <h3 className="text-lg font-semibold text-green-700">
              {complaint.name || "Public User"}
            </h3>

            <p className="text-sm text-gray-500">
              {complaint.location || "Unknown"}
            </p>

            {/* ✅ NEW: EMAIL DISPLAY */}
            <p className="text-sm text-gray-500">
              {complaint.email || ""}
            </p>

            {/* ONLY FIRST LINE */}
            <p className="mt-3 text-gray-700">
              {complaint.message?.split("\n")[0]}
            </p>

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
                onClick={(e) => {
                  e.stopPropagation();
                  clearComplaint(complaint._id);
                }}
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

      {/* ==============================
         MODAL VIEW
      ============================== */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-[400px] max-h-[80vh] overflow-y-auto">

            <h2 className="text-xl font-semibold text-green-700 mb-2">
              {selectedComplaint.name}
            </h2>

            <p className="text-sm text-gray-500 mb-1">
              {selectedComplaint.location}
            </p>

            {/* ✅ NEW: EMAIL IN MODAL */}
            <p className="text-sm text-gray-500 mb-3">
              {selectedComplaint.email}
            </p>

            <p style={{ whiteSpace: "pre-line" }} className="mb-4 text-gray-700">
              {selectedComplaint.message}
            </p>

            {selectedComplaint.image && (
              <img
                src={selectedComplaint.image}
                alt="Complaint"
                className="mb-4 rounded-lg border"
              />
            )}

            <button
              onClick={() => setSelectedComplaint(null)}
              className="w-full bg-gray-300 hover:bg-gray-400 py-2 rounded-lg"
            >
              Close
            </button>

          </div>
        </div>
      )}
    </AdminLayout>
  );
}