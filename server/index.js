import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { OAuth2Client } from "google-auth-library";

// Import model and routes
import User from "./src/models/User.js";
import uploadRoutes from "./src/routes/upload.js";
import chatRoutes from "./src/routes/chat.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

app.use(cors({
  origin: [
     process.env.CLIENT_URL,
      "http://localhost:5173",
  ],
   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
      sameSite: "none", 
      secure: true,    
    },
}));

// 🔹 Google login route
app.post("/auth/google", async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).send("No token provided");

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = await User.create({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
      });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(401).send("Invalid token");
  }
});

// 🔹 Session check route
app.get("/auth/session", (req, res) => {
  if (req.session.user)
    res.json({ loggedIn: true, user: req.session.user });
  else
    res.json({ loggedIn: false });
});

// 🔹 Mount your PDF upload route
app.use("/api/upload", uploadRoutes);
app.use("/api/chat",chatRoutes)

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
