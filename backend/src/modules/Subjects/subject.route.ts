import { Router } from "express";
import { SubjectController } from "./subject.controller";

const SubjectRoutes = Router()

SubjectRoutes.post("/", SubjectController.createSubject);
SubjectRoutes.get("/", SubjectController.getAllSubjects);
SubjectRoutes.get("/:slug", SubjectController.getSingleSubject);
SubjectRoutes.patch("/:slug", SubjectController.updateSubject);
SubjectRoutes.delete("/:slug", SubjectController.deleteSubject);
export default SubjectRoutes