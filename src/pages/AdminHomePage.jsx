import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import AdminLayout from "../components/Layout/AdminLayout";

export default function AdminHomePage({ pendingCount }) {

  const [bins, setBins] = useState([]);
  const [complaintCount, setComplaintCount] = useState(0);

  /* ==============================
     FETCH BIN DATA
  ============================== */

  const fetchBins = () => {

    fetch("https://smart-dustbin-backend.onrender.com/bins")
      .then(res => res.json())
      .then(data => {

        const formatted = data.map(bin => ({

          id: bin._id,
          binId: bin.binId,
          updatedAt: bin.updatedAt,
          isOnline: bin.isOnline,

          area: bin.binId || "Unknown Area",

          fillStatus: bin.fillStatus,

          level:
            bin.fillStatus === "FULL"
              ? 100
              : bin.distance
              ? Math.round(Math.max(0, 100 - bin.distance * 10))
              : 0,

          gas: bin.gasStatus === "POOR" ? "Harmful" : "Safe",

          locked: bin.locked

        }));

        setBins(formatted);

      })
      .catch(err => console.error("Error fetching bins:", err));
  };

  /* ==============================
     FETCH COMPLAINT COUNT
  ============================== */

  const fetchComplaints = () => {

    fetch("https://smart-dustbin-backend.onrender.com/complaints")
      .then(res => res.json())
      .then(data => {

        const count = data.filter(
          c => c.status === "pending"
        ).length;

        setComplaintCount(count);

      });

  };

  /* ==============================
     REAL-TIME + POLLING
  ============================== */

  useEffect(() => {

    fetchBins();
    fetchComplaints();

    const socket = io("https://smart-dustbin-backend.onrender.com");

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("binUpdated", () => {
      console.log("⚡ Instant update");
      fetchBins();
    });

    const interval = setInterval(() => {
      fetchBins();
    }, 5000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };

  }, []);

  /* ==============================
     DEMO MODE CONTROL
  ============================== */

  const demoUpdate = async (binId, fillStatus, gasStatus) => {

    await fetch(
      `https://smart-dustbin-backend.onrender.com/bins/${binId}/demo`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fillStatus,
          gasStatus
        })
      }
    );

    fetchBins();

  };

  /* ==============================
     LOCK / UNLOCK BIN
  ============================== */

  const toggleLock = async (binId, locked) => {

    if (locked) {

      const confirmUnlock = window.confirm(
        "Are you sure you want to unlock this bin?"
      );

      if (!confirmUnlock) return;

    }

    await fetch(
      `https://smart-dustbin-backend.onrender.com/bins/${binId}/lock`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    fetchBins();

  };

  /* ==============================
     STATUS CALCULATIONS
  ============================== */

  const totalBins = bins.length;

  const fullBins = bins.filter(
    bin => bin.fillStatus === "FULL"
  ).length;

  const gasAlerts = bins.filter(
    bin => bin.gas === "Harmful"
  ).length;

  /* ==============================
     DEVICE ONLINE STATUS
  ============================== */

  let deviceStatus = "Offline";

  if (bins.length > 0 && bins[0].updatedAt) {

    const lastUpdate = new Date(bins[0].updatedAt).getTime();
    const now = new Date().getTime();
    const diffSeconds = (now - lastUpdate) / 1000;

    if (diffSeconds < 10) {
      deviceStatus = "Online";
    }

  }

  return (

    <AdminLayout pendingCount={complaintCount}>

      <h2 className="text-3xl font-bold text-green-700 mb-10">
        IoT Smart Dustbin Dashboard
      </h2>

      {/* STATUS BANNER */}

      <div className="bg-white shadow-lg rounded-xl p-4 mb-6 flex flex-wrap gap-4 text-sm font-medium">

        <span className={`px-3 py-1 rounded-full ${
          deviceStatus === "Online"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {deviceStatus === "Online"
            ? "🟢 Device Online"
            : "🔴 Device Offline"}
        </span>

        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          🗑 Bins Active: {totalBins}
        </span>

        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full">
          🔴 Full Bins: {fullBins}
        </span>

        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
          ⚠ Gas Alerts: {gasAlerts}
        </span>

        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
          📢 Pending Complaints: {complaintCount}
        </span>

      </div>

      {/* DEMO CONTROLS */}

      <div className="bg-white shadow-lg rounded-xl p-4 mb-6">

        <h3 className="font-semibold text-gray-700 mb-3">
          Demo Controls
        </h3>

        <div className="flex flex-wrap gap-3">

          <button
            onClick={() => demoUpdate("BIN001", "FULL", "POOR")}
            className="bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            Make BIN001 FULL
          </button>

          <button
            onClick={() => demoUpdate("BIN001", "ACTIVE", "GOOD")}
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Make BIN001 EMPTY
          </button>

          <button
            onClick={() => demoUpdate("BIN001", "ACTIVE", "POOR")}
            className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
          >
            Simulate Gas Leak
          </button>

        </div>

      </div>

      {/* BIN CARDS */}

      <div className="grid md:grid-cols-3 gap-8">

        {bins.map((bin) => {

          const isFull = bin.fillStatus === "FULL";
          const isHarmful = bin.gas === "Harmful";
          const isLow = bin.level < 5;

          return (

            <div
              key={bin.id}
              className={`bg-white p-6 rounded-2xl shadow-xl border transition
                ${isFull ? "border-red-400 animate-pulse" : "border-green-200"}
              `}
            >

              <h2 className="text-lg font-semibold text-green-700 mb-3">
                {bin.area}
              </h2>

              <p className="text-gray-600 mb-2">Fill Level</p>

              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">

                <div
                  className={`h-3 rounded-full ${
                    isFull
                      ? "bg-red-500"
                      : bin.level > 60
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${bin.level}%` }}
                ></div>

              </div>

              <p className={`mb-3 ${isFull ? "text-red-600 font-bold" : ""}`}>
                {isFull
                  ? "FULL"
                  : isLow
                  ? "LOW"
                  : `${bin.level}%`}
              </p>

              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  isHarmful
                    ? "bg-red-200 text-red-800 animate-pulse"
                    : "bg-green-200 text-green-800"
                }`}
              >
                Gas: {bin.gas}
              </span>

              <div className="mt-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    bin.locked
                      ? "bg-red-500 text-white"
                      : "bg-green-500 text-white"
                  }`}
                >
                  {bin.locked ? "Locked" : "Unlocked"}
                </span>

              </div>

              <button
                onClick={() => toggleLock(bin.binId, bin.locked)}
                className={`mt-4 w-full py-2 rounded-xl transition ${
                  bin.locked
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {bin.locked ? "Unlock Bin" : "Lock Bin"}
              </button>

            </div>

          );

        })}

      </div>

    </AdminLayout>

  );

}