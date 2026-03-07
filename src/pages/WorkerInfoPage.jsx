import { useState, useEffect } from "react";
import AdminLayout from "../components/Layout/AdminLayout";

export default function WorkerInfoPage({ pendingCount }) {
  const [workers, setWorkers] = useState([]);

  /* ===================================
     FETCH WORKERS FROM BACKEND
  =================================== */
  useEffect(() => {
    const fetchWorkers = () => {
      fetch("https://smart-dustbin-backend.onrender.com/workers")
        .then((res) => res.json())
        .then((data) => {
          setWorkers(data);
        })
        .catch((err) => console.error("Error fetching workers:", err));
    };

    fetchWorkers();
  }, []);

  return (
    <AdminLayout pendingCount={pendingCount}>

      <h2 className="text-3xl font-bold text-green-700 mb-10">
        Worker Information
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workers.map((worker) => (
          <div
            key={worker._id}
            className="backdrop-blur-xl bg-white/70 border border-green-200 p-6 rounded-3xl shadow-xl hover:scale-105 transition"
          >
            <div className="flex justify-center mb-4">
              <img
                src={worker.photo || "https://via.placeholder.com/150"}
                alt={worker.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-green-300 shadow"
              />
            </div>

            <h2 className="text-xl font-semibold text-green-700 text-center mb-2">
              {worker.name}
            </h2>

            <div className="space-y-2 text-sm text-gray-700">
              <p><strong>Phone:</strong> {worker.phone}</p>

              <p>
                <strong>UID:</strong>{" "}
                <span className="bg-green-100 px-2 py-1 rounded-lg">
                  {worker.uid}
                </span>
              </p>

              <p><strong>Area:</strong> {worker.location}</p>
            </div>
          </div>
        ))}
      </div>

    </AdminLayout>
  );
}