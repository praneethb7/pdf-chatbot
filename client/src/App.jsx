import Landing from "./pages/Landing.jsx"
import { GoogleOAuthProvider } from "@react-oauth/google";
import Chat from "./pages/Chat.jsx";
import { Routes, Route } from "react-router-dom";



function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </GoogleOAuthProvider>
  )
}

export default App