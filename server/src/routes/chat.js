import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import Chat from "../models/Chat.js";

dotenv.config();
const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST: Send prompt for a PDF
router.post("/", async (req, res) => {
  const { userId, pdfText, prompt } = req.body;
  if (!userId || !pdfText || !prompt) return res.status(400).send("All fields required");

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const fullPrompt = `PDF Content: ${pdfText}\n\nQuestion: ${prompt}\nAnswer concisely.`;

    const result = await model.generateContent(fullPrompt);
    const botResponse = result.response.text();

    let chat = await Chat.findOne({ user: userId, pdfText });

    if (!chat) {
      chat = await Chat.create({
        user: userId,
        pdfText,
        messages: [
          { role: "user", content: prompt },
          { role: "bot", content: botResponse },
        ],
      });
    } else {
      chat.messages.push({ role: "user", content: prompt });
      chat.messages.push({ role: "bot", content: botResponse });
      await chat.save();
    }

    return res.json({ response: botResponse, chatId: chat._id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error generating response from Gemini");
  }
});

// GET: Fetch all chats for a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).send("Missing userId");

  try {
    const chats = await Chat.find({ user: userId }).sort({ createdAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching chats");
  }
});

export default router;
