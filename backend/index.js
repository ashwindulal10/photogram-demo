import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// ROUTES
import authRoutes from "./routes/auth.js";
import mediaRoutes from "./routes/mediaRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static("uploads"));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("Mongo error:", err));

// AUTH routes
app.use("/auth", authRoutes);

// MEDIA routes
// IMPORTANT: your frontend must call /api/media/...
app.use("/api/media", mediaRoutes);

// Home test route
app.get("/", (req, res) => {
  res.send("Backend running!");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
