import multer from "multer";
import storage from "../modules/pdfImport/uploader/storage";
import { PDF_MAX_FILE_SIZE } from "../modules/pdfImport/pdfImport.constant";

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Only PDF files are allowed."));
  }

  cb(null, true);
};

export const uploadPdf = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: PDF_MAX_FILE_SIZE,
    files: 1,
  },
});
