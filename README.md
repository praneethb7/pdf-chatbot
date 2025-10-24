# 📄 PDF Chatbot

A modern **AI-powered chatbot** that lets users **upload a PDF** and **chat with it** — asking questions, summarizing content, and exploring information interactively.  
Built with the **MERN stack**, **Google OAuth 2.0 login**, and **Gemini API** for intelligent PDF understanding.

---

## 🚀 Live Demo

🌐 **Frontend (Client):** [https://pdf-chatbot-seven-rho.vercel.app](https://pdf-chatbot-seven-rho.vercel.app)  
🖥️ **Backend (Server):** [https://pdf-chatbot-api-lvch.onrender.com](https://pdf-chatbot-api-lvch.onrender.com)

---

## 🧠 Features

✅ **Google Sign-In** – Secure login via Google OAuth 2.0  
✅ **PDF Upload** – Parse and extract text directly from uploaded PDFs  
✅ **AI Chat** – Ask natural language questions about your uploaded document  
✅ **Persistent Chats** – Chats are stored per user in MongoDB  
✅ **Session Management** – Using Express sessions + cookies  
✅ **Cross-Origin Support** – Full CORS and HTTPS setup for Vercel + Render deployment  
✅ **Beautiful UI** – Minimal black/white interface built with TailwindCSS

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite) + TailwindCSS + React Router |
| **Backend** | Express.js + Node.js |
| **Database** | MongoDB (Mongoose) |
| **Auth** | Google OAuth 2.0 (`@react-oauth/google` + `google-auth-library`) |
| **AI** | Gemini API |
| **File Handling** | Multer + PDF-Parse |
| **Hosting** | Vercel (client) + Render (server) |

---

## 🧩 Folder Structure

```

pdf-chatbot/
├── client/                    # React frontend
│   ├── src/
│   │   ├── api/axios.js       # Axios instance with credentials
│   │   ├── pages/
│   │   │   ├── Landing.jsx    # Google login + PDF upload page
│   │   │   └── Chat.jsx       # Chat UI + message handling
│   │   └── App.jsx            # Routes + GoogleOAuthProvider
│   └── vite.config.js
│
├── server/
│   ├── src/
│   │   ├── models/User.js
│   │   ├── routes/upload.js   # PDF upload & text extraction
│   │   └── routes/chat.js     # Chat routes (Gemini API integration)
│   └── index.js               # Express app entry point
│
├── .env                       # Environment variables
└── README.md

````

---

## ⚙️ Setup Instructions (Local Development)

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/<your-username>/pdf-chatbot.git
cd pdf-chatbot
````

### 2️⃣ Install Dependencies

For both frontend and backend:

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

---

### 3️⃣ Create a `.env` file in `/server`

```env
PORT=8000
CLIENT_URL=http://localhost:5173

# MongoDB
MONGO_URI=mongodb+srv://<your-cluster-url>

# Google OAuth
GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-secret>
GOOGLE_CALLBACK_URL=http://localhost:8000/auth/google/callback

# Gemini API
GEMINI_API_KEY=<your-gemini-api-key>

SESSION_SECRET=someRandomSecret123
```

---

### 4️⃣ Create a `.env` file in `/client`

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
```

---

### 5️⃣ Start the App

#### Start backend

```bash
cd server
npm run dev
```

#### Start frontend

```bash
cd ../client
npm run dev
```

Frontend will be available at → [http://localhost:5173](http://localhost:5173)

---

## ☁️ Deployment

| Platform              | URL                                                                                    | Notes                               |
| --------------------- | -------------------------------------------------------------------------------------- | ----------------------------------- |
| **Frontend (Vercel)** | [https://pdf-chatbot-seven-rho.vercel.app](https://pdf-chatbot-seven-rho.vercel.app)   | Must include deployed API in `.env` |
| **Backend (Render)**  | [https://pdf-chatbot-api-lvch.onrender.com](https://pdf-chatbot-api-lvch.onrender.com) | Must whitelist `CLIENT_URL` in CORS |

---

## 🔐 OAuth Setup (Google Cloud Console)

1. Go to **[Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)**
2. Create **OAuth 2.0 Client ID**
3. Add:

   * **Authorized JavaScript Origins:**

     * `http://localhost:5173`
     * `https://pdf-chatbot-seven-rho.vercel.app`
   * **Authorized Redirect URIs:**

     * same as above (no `/callback` needed)

---

## 🧩 Troubleshooting

| Problem                                                     | Fix                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `Cross-Origin-Opener-Policy would block window.postMessage` | Ensure COOP/COEP headers are disabled via middleware in Express                |
| 403 Forbidden (PDF Upload)                                  | Verify CORS origin matches exactly (no trailing slash)                         |
| Session not persisting                                      | Use HTTPS + `sameSite: "none"` + `secure: true` in cookie settings             |
| Google Login Popup not working                              | Ensure correct `VITE_GOOGLE_CLIENT_ID` and Authorized Origins in Cloud Console |

---

## 👨‍💻 Developers

👤 **Praneeth Budati** — [GitHub](https://github.com/praneethbudati)

---



### ⭐ If you found this helpful, don’t forget to star the repo!

