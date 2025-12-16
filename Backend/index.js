// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

import { chatController } from './CONTROLLER/chat.js';
import { showcontroller } from './CONTROLLER/Show.js';
import { handleUpload } from './CONTROLLER/uploadcontroller.js';

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB (optional, for future use)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/heartsync', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(path.resolve(), 'Frontend')));

// Middleware to extract API key from headers
app.use((req, res, next) => {
  const userApiKey = req.headers['x-gemini-api-key'];
  if (userApiKey) {
    req.geminiApiKey = userApiKey;
  }
  next();
});

// Upload Setup
const uploadDir = path.join(path.resolve(), 'Backend', 'data');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname) // Rename in controller
});
const upload = multer({ storage });

// Routes
app.get('/', showcontroller);
app.post('/upload-chat', upload.single('chatFile'), handleUpload);
app.post('/chat', chatController);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
