import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [pdfUploaded, setPdfUploaded] = useState(false);

  // Check session on mount
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await axios.get("http://localhost:8000/auth/session", { withCredentials: true });
        if (res.data.loggedIn) {
          setUser(res.data.user);
          if (localStorage.getItem("pdfText")) setPdfUploaded(true);
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      }
    };
    fetchSession();
  }, []);

  // Google Sign-In Success
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/auth/google",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );
      setUser(res.data.user);
      console.log("Login successful:", res.data);

      // If PDF already uploaded, allow chat
      if (localStorage.getItem("pdfText")) {
        navigate("/chat");
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  // PDF Upload Handler
  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      setUploading(true);
      const res = await axios.post("http://localhost:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const uploadedPdfText = res.data.text;

      // Store PDF text in localStorage
      localStorage.setItem("pdfText", uploadedPdfText);
      setPdfUploaded(true);

      // If user is logged in, go to chat
      if (user) navigate("/chat");
    } catch (err) {
      console.error("Error uploading PDF:", err);
      alert("Failed to upload PDF");
    } finally {
      setUploading(false);
    }
  };

  // Log out / change account
  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Error logging out:", err);
    }
    setUser(null);
    setPdfUploaded(false);
    localStorage.removeItem("pdfText");
  };

  return (
    <div className="bg-black h-screen text-white flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-10 py-5 border-b border-white">
        <h1 className="text-4xl font-semibold">pdf-chatbot</h1>
        <div className="flex items-center gap-4">
          {user && <span className="text-xl text-gray-300">Signed in as {user.name}</span>}
          {user && (
            <button
              onClick={handleLogout}
              className="bg-white text-black px-3 py-1 rounded-lg hover:bg-gray-300 transition"
            >
              Log Out 
            </button>
          )}
        </div>
      </div>

      {/* Centered Container */}
      <div className="flex flex-col items-center justify-center flex-grow gap-6">
        {/* Google Login */}
        {!user && (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => console.log("Login Failed")}
          />
        )}

        {/* Upload Button */}
        <div className="text-center">
          <label
            htmlFor="pdf-upload"
            className={`cursor-pointer bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all ${
              !user ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Upload your PDF"}
          </label>
          <input
            id="pdf-upload"
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={handlePDFUpload}
            disabled={uploading || !user}
          />
        </div>

        {/* Guidance messages */}
        {!user && <p className="text-gray-400 mt-4">You must sign in to continue.</p>}
        {user && !pdfUploaded && <p className="text-gray-400 mt-4">Upload a PDF to start chatting.</p>}
      </div>
    </div>
  );
}
