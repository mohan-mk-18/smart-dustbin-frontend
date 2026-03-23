import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PublicComplaintPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const [isRecording, setIsRecording] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ NEW
  const [loading, setLoading] = useState(false);

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
     SPEECH RECOGNITION
  =========================== */
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + " " + transcript);
    };

    recognition.onend = () => setIsRecording(false);

    recognitionRef.current = recognition;
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }

    setIsRecording(!isRecording);
  };

  /* ===========================
     IMAGE UPLOAD
  =========================== */
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(URL.createObjectURL(file));
    setImageFile(file);
  };

  /* ===========================
     SEND COMPLAINT
  =========================== */
  const handleSend = async () => {
    setShowConfirm(false);

    if (!input && !imageFile) return;

    setLoading(true); // ✅ START LOADING

    const messageData = {
      id: Date.now(),
      text: input,
      image: image || null,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, messageData]);

    try {
      const formData = new FormData();

      formData.append("name", name || "Public User");
      formData.append("email", email || "");
      formData.append("location", location || "Unknown");
      formData.append("message", input);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const response = await fetch(
        "https://smart-dustbin-backend.onrender.com/complaints",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit complaint");
      }

      // RESET
      setInput("");
      setImage(null);
      setImageFile(null);
      setName("");
      setEmail("");
      setLocation("");

      setLoading(false); // ✅ STOP LOADING

      // KEEP REDIRECT (as you want)
      setTimeout(() => {
        navigate("/public/success");
      }, 1000);

    } catch (error) {
      console.error("Error submitting complaint:", error);
      alert("Failed to submit complaint. Please try again.");
      setLoading(false); // ✅ STOP LOADING
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-green-100">

      <div className="bg-green-600 text-white p-4 text-center text-xl font-semibold shadow-md">
        Submit Your Complaint
      </div>

      {/* USER INPUTS */}
      <div className="px-6 pt-4 space-y-2">
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg"
        />
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className="flex justify-end">
            <div className="bg-green-600 text-white p-3 rounded-2xl rounded-br-sm max-w-xs shadow-md">
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

        <label className="cursor-pointer text-green-600 text-xl">
          📎
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageUpload}
            disabled={loading}
          />
        </label>

        <button
          onClick={toggleRecording}
          className="text-xl text-green-600"
          disabled={loading}
        >
          🎤
        </button>

        <textarea
          placeholder="Type your complaint..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          disabled={loading}
          className="flex-1 px-4 py-2 rounded-xl border border-gray-300"
        />

        <button
          onClick={() => setShowConfirm(true)}
          disabled={loading}
          className={`px-4 py-2 rounded-full text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600"
          }`}
        >
          {loading ? "Submitting..." : "Send"}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">

          <div className="bg-white rounded-2xl p-6 w-80 text-center">

            <h2 className="text-xl font-semibold mb-4">
              Confirm Complaint
            </h2>

            <p className="mb-6">
              Are you sure you want to submit this complaint?
            </p>

            <div className="flex justify-center gap-4">

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                onClick={handleSend}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600"
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}