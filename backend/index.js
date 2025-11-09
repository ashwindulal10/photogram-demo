import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { randomUUID } from 'crypto';

// Setup path helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

let media = [];

// ✅ Upload route
app.post('/media/upload', upload.single('file'), (req, res) => {
  const { title, caption } = req.body;
  const newMedia = {
    id: randomUUID(),
    filename: req.file.filename,
    title,
    caption,
  };
  media.push(newMedia);
  res.json(newMedia);
});

// ✅ Get all media
app.get('/media', (req, res) => {
  res.json(media);
});

// ✅ Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

app.post('/media/upload', upload.single('file'), async (req, res) => {
  console.log("Upload received:", req.file); // 👈 add this
  const { title, caption } = req.body;

  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  const newMedia = {
    id: randomUUID(),
    filename: req.file.filename,
    title,
    caption,
    comments: [],
    ratings: []
  };

  media.push(newMedia);
  await saveMedia();
  console.log("Saved media:", newMedia); // 👈 add this
  res.json(newMedia);
});
