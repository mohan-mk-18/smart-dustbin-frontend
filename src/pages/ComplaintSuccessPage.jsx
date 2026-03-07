import { useNavigate } from "react-router-dom";

export default function ComplaintSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center w-[90%] max-w-md">
        <div className="text-5xl text-green-600 mb-4">✓</div>

        <h2 className="text-2xl font-bold text-green-700 mb-4">
          Complaint Submitted Successfully!
        </h2>

        <button
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}