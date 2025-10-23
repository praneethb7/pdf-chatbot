import Landing from "./pages/Landing"
import { GoogleOAuthProvider } from "@react-oauth/google";
import Chat from "./pages/CHat";
import { Routes, Route } from "react-router-dom";



function App() {
  return (
   <GoogleOAuthProvider clientId="409898731649-bac5vss69eq722n7ddsmo49sqqlbn203.apps.googleusercontent.com"> 
   <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/chat" element={<Chat />} />
    </Routes>
    </GoogleOAuthProvider>
  )
}

export default App