import fs from "fs";
import path from "path";
import multer from "multer";
import crypto from "crypto";

const uploadDir = path.join(process.cwd(), "uploads", "pdfs");

// Create upload directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },

  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);

    const filename = `${Date.now()}-${crypto.randomUUID()}${ext}`;

    cb(null, filename);
  },
});
