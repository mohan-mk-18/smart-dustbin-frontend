import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PublicComplaintPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  /* ===========================
     AUTO SCROLL
  =========================== */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ===========================
     SPEECH RECOGNITION SETUP
  =========================== */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsRecording(!isRecording);
  };

  /* ===========================
     FIXED IMAGE UPLOAD
  =========================== */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result); // base64 image
    };

    reader.readAsDataURL(file);
  };

  /* ===========================
     SEND COMPLAINT TO BACKEND
  =========================== */
  const handleSend = async () => {

    setShowConfirm(false);

    if (!input && !image) return;

    const messageData = {
      id: Date.now(),
      text: input,
      image,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, messageData]);

    try {
      const response = await fetch(
        "https://smart-dustbin-backend.onrender.com/complaints",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: "Public User",
            location: "Portal",
            message: input,
            image: image || "",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      setInput("");
      setImage(null);

      setTimeout(() => {
        navigate("/public/success");
      }, 1000);

    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">

      <div className="bg-green-600 text-white p-4 text-center text-xl font-semibold shadow-md">
        Submit Your Complaint
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-end">
            <div className="bg-green-600 text-white p-3 rounded-2xl rounded-br-sm max-w-xs shadow-md animate-fadeIn">
              {msg.text && <p className="mb-2">{msg.text}</p>}
              {msg.image && (
                <img
                  src={msg.image}
                  alt="uploaded"
                  className="rounded-lg mb-2 max-h-40"
                />
              )}
              <div className="text-xs text-green-100 text-right">
                {msg.time}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef}></div>
      </div>

      {image && (
        <div className="px-6 pb-2">
          <img
            src={image}
            alt="preview"
            className="max-h-32 rounded-lg shadow border"
          />
        </div>
      )}

      <div className="bg-white p-4 flex items-center gap-3 shadow-inner">

        <label className="cursor-pointer text-green-600 text-xl hover:scale-110 transition">
          📎
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
          />
        </label>

        <button
          onClick={toggleRecording}
          className={`text-xl hover:scale-110 transition ${
            isRecording
              ? "text-red-600 animate-pulse"
              : "text-green-600"
          }`}
        >
          🎤
        </button>

        <input
          type="text"
          placeholder="Type your complaint..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={() => setShowConfirm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 transition"
        >
          Send
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">

          <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 text-center animate-fadeIn">

            <h2 className="text-xl font-semibold text-green-700 mb-4">
              Confirm Complaint
            </h2>

            <p className="text-gray-600 mb-6">
              Are you sure you want to submit this complaint?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                className="px-4 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
              >
                Submit
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}