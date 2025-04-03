const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { scheduleEmailJob } = require("./utils/cronjob");
require("dotenv").config();

const app = express();

// FIXED: CORS Configuration for cross-origin cookie handling
const allowedOrigins = [
  "http://localhost:5173", // Vite local dev
  "http://localhost:3000", // React local dev (alternative port)
  "https://www.vibenweb.xyz", // Production frontend (Netlify)
  "https://vibenweb.xyz", // Non-www version of production frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Critical for cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    exposedHeaders: ["Set-Cookie"], // Important for cookie visibility
    maxAge: 86400,
  })
);

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Prefix all API routes with `/api`
app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ 
    status: "ok", 
    message: "Server is running",
    cors: {
      allowedOrigins,
      credentials: true
    }
  });
});

// Database Connection
const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Database connected successfully");

    // Schedule email job (if used in your app)
    scheduleEmailJob(4);
  } catch (err) {
    console.error("❌ Database connection failed:", err);
  }
};

// Start Server
connectDb().then(() => {
  const PORT = process.env.PORT || 7777;
  app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
  });
});

module.exports = app;