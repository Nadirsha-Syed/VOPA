const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || ".webm";
    cb(null, `reading-${uniqueSuffix}${ext}`);
  },
});

// File filter (accept audio formats)
const fileFilter = (_req, file, cb) => {
  const allowedMimeTypes = [
    "audio/webm",
    "audio/wav",
    "audio/wave",
    "audio/x-wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/m4a",
    "audio/mp4",
    "audio/x-m4a",
  ];

  if (allowedMimeTypes.includes(file.mimetype) || file.mimetype.startsWith("audio/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only audio files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: (parseInt(process.env.MAX_AUDIO_SIZE_MB, 10) || 10) * 1024 * 1024, // Default 10MB
  },
});

module.exports = upload;
