import { Router } from "express";
import { SubjectController } from "./subject.controller";
import { ChapterController } from "../Chapters/chapter.controller";

const SubjectRoutes = Router()

SubjectRoutes.post("/", SubjectController.createSubject);
SubjectRoutes.get("/", SubjectController.getAllSubjects);
// Get chapters by subject (must come before /:id)
SubjectRoutes.get(
  "/:subjectId/chapters",
  ChapterController.getChaptersBySubject,
);
SubjectRoutes.get("/:slug", SubjectController.getSingleSubject);
SubjectRoutes.patch("/:slug", SubjectController.updateSubject);
SubjectRoutes.delete("/:slug", SubjectController.deleteSubject);
export default SubjectRoutes