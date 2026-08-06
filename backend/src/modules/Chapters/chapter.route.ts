import { Router } from "express";
import { ChapterController } from "./chapter.controller";
import { TopicController } from "../Topics/topic.controller";
import { UserRole } from "../users/user.constants";
import auth from "../../middlewares/auth";

const ChapterRoutes = Router();

// Create
ChapterRoutes.post("/", ChapterController.createChapter);
ChapterRoutes.post(
  "/bulk",
  auth(UserRole.ADMIN),
  ChapterController.createBulkChapter,
);

// Read
ChapterRoutes.get("/", ChapterController.getAllChapters);



// Single chapter
ChapterRoutes.get("/:id", ChapterController.getSingleChapter);

// Update
ChapterRoutes.patch("/:id", ChapterController.updateChapter);

// Delete
ChapterRoutes.delete("/:id", ChapterController.deleteChapter);
ChapterRoutes.get("/:chapterId/topics", TopicController.getTopicsByChapter);
export default ChapterRoutes;
