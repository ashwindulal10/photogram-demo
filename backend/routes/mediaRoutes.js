import express from "express";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import Media from "../models/Media.js";
import Comment from "../models/Comment.js";
import Rating from "../models/Rating.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// ----------------------------------
// Multer Storage
// ----------------------------------
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ----------------------------------
// Upload media
// ----------------------------------
router.post("/upload", auth, upload.single("file"), async (req, res) => {
  try {
    const media = new Media({
      title: req.body.title,
      caption: req.body.caption,
      filename: req.file.filename,
      user: req.user.id
    });

    await media.save();
    res.json({ message: "Uploaded successfully", media });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

// ----------------------------------
// Get all media
// ----------------------------------
router.get("/", async (req, res) => {
  const media = await Media.find().sort({ createdAt: -1 });
  res.json(media);
});

// ----------------------------------
// Add comment
// ----------------------------------
router.post("/comment", auth, async (req, res) => {
  const { mediaId, text } = req.body;

  const c = new Comment({
    mediaId,
    text,
    user: req.user.id
  });

  await c.save();
  res.json({ message: "Comment added" });
});

// Get comments for one media
router.get("/:id/comments", async (req, res) => {
  const list = await Comment.find({ mediaId: req.params.id });
  res.json(list);
});

// ----------------------------------
// Rate media
// ----------------------------------
router.post("/rate", auth, async (req, res) => {
  const { mediaId, stars } = req.body;

  const r = new Rating({
    mediaId,
    stars,
    user: req.user.id
  });

  await r.save();
  res.json({ message: "Rating saved" });
});

// Get average rating
router.get("/:id/rating", async (req, res) => {
  const list = await Rating.find({ mediaId: req.params.id });

  if (list.length === 0) return res.json({ avg: 0 });

  const avg =
    list.reduce((sum, r) => sum + r.stars, 0) / list.length;

  res.json({ avg });
});

export default router;
