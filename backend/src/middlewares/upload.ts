import multer from "multer";

// ============================================================
// FILE FILTER
// ============================================================

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, JPEG, PNG and WEBP images are allowed."));
  }
};

// ============================================================
// MULTER
// ============================================================
//
// IMPORTANT:
// Cloudinary service uses file.buffer.
// Therefore memoryStorage() is required.
// ============================================================

export const upload = multer({
  storage: multer.memoryStorage(),

  fileFilter,

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;
