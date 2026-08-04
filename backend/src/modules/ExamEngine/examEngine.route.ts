import express from "express";
import { ExamEngineController } from "./examEngine.controller";
import { startExamValidationSchema } from "./examEngine.validation";
import auth from "../../middlewares/auth";
import validateRequest from "../../utils/validateRequest";
import { UserRole } from "../users/user.constants";

const ExamEngineRoutes = express.Router();

ExamEngineRoutes.post(
  "/start",
  auth(UserRole.USER, UserRole.ADMIN),
  validateRequest(startExamValidationSchema),
  ExamEngineController.startExam,
);
// ExamEngineRoutes.post("/start", ExamEngineController.startExam);
// ExamEngineRoutes.post("/preview", ExamEngineController.previewExam);
export default ExamEngineRoutes;
