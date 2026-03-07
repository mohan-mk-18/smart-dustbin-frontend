import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 flex items-center justify-center px-6">
      
      <div className="backdrop-blur-lg bg-white/60 border border-green-200 shadow-2xl rounded-3xl p-12 max-w-4xl w-full text-center">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-green-700 drop-shadow-lg">
          Smart Hygiene Management System
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-lg md:text-xl text-gray-700">
          IoT-Driven Smart Waste Management
        </p>

        {/* Buttons */}
        <div className="mt-12 flex flex-col md:flex-row gap-6 justify-center">
          
          <button
            onClick={() => navigate("/public/details")}
            className="px-8 py-4 bg-green-600 text-white font-semibold rounded-xl shadow-lg hover:scale-105 hover:bg-green-700 transition duration-300"
          >
            Public Portal
          </button>

          <button
            onClick={() => navigate("/admin/login")}
            className="px-8 py-4 border-2 border-green-600 text-green-700 font-semibold rounded-xl shadow-lg hover:bg-green-600 hover:text-white hover:scale-105 transition duration-300"
          >
            Admin Portal
          </button>

        </div>

      </div>
    </div>
  );
}