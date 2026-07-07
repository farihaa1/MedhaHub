import { Router } from "express";
import { TopicController } from "./topic.controller";

const TopicRoutes = Router();

TopicRoutes.post("/", TopicController.createTopic);

TopicRoutes.get("/", TopicController.getAllTopics);

TopicRoutes.get("/chapter/:chapterId", TopicController.getTopicsByChapter);

TopicRoutes.get("/:id", TopicController.getSingleTopic);

TopicRoutes.patch("/:id", TopicController.updateTopic);

TopicRoutes.delete("/:id", TopicController.deleteTopic);

export default TopicRoutes 
