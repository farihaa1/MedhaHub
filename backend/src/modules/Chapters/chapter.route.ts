import { Router } from "express";
import { ChapterController } from "./chapter.controller";

const router = Router();

router.post("/", ChapterController.createChapter);
router.get("/", ChapterController.getAllChapters);
router.get("/:id", ChapterController.getSingleChapter);
router.patch("/:id", ChapterController.updateChapter);
router.delete("/:id", ChapterController.deleteChapter);
router.get("/subject/:subjectId", ChapterController.getChaptersBySubject);

export const ChapterRoutes = router;
