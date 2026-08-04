import express from "express";

import { upload } from "../../middlewares/upload";
import { UploadController } from "./upload.controller";

const UploadRoutes = express.Router();

UploadRoutes.post("/image", upload.single("file"), UploadController.uploadImage);

export default UploadRoutes ;
