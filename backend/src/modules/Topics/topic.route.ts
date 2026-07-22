import { Router } from "express";
import { TopicController } from "./topic.controller";

const TopicRoutes = Router();

TopicRoutes.post("/", TopicController.createTopic);

TopicRoutes.post("/bulk", TopicController.createBulkTopics);

TopicRoutes.get("/", TopicController.getAllTopics);

TopicRoutes.get("/chapter/:chapterId", TopicController.getTopicsByChapter);

TopicRoutes.get("/:id", TopicController.getSingleTopic);

TopicRoutes.patch("/:id", TopicController.updateTopic);
TopicRoutes.patch("/:id/move", TopicController.moveTopic);

TopicRoutes.post("/merge", TopicController.mergeTopics);

TopicRoutes.delete("/:id", TopicController.deleteTopic);
TopicRoutes.delete("/", TopicController.deleteAllTopic);

export default TopicRoutes 
