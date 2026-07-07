import { Router } from "express";
import { ChapterRoutes } from "../modules/Chapters/chapter.route";
import SubjectRoutes from "../modules/Subjects/subject.route";

const router = Router();

router.use("/subjects", SubjectRoutes);
router.use("/chapters", ChapterRoutes);

export default router;
