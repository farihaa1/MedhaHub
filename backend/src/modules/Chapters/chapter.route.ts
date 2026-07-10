import { Router } from "express";
import { ChapterController } from "./chapter.controller";
import { TopicController } from "../Topics/topic.controller";

const ChapterRoutes = Router();

// Create
ChapterRoutes.post("/", ChapterController.createChapter);

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
