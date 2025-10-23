import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pdfText: String,           // full text extracted from PDF
  messages: [                // array of Q&A messages
    {
      role: String,          // "user" or "bot"
      content: String,
      createdAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Chat", chatSchema);
