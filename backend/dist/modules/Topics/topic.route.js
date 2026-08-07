"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const topic_controller_1 = require("./topic.controller");
const TopicRoutes = (0, express_1.Router)();
TopicRoutes.post("/", topic_controller_1.TopicController.createTopic);
TopicRoutes.post("/bulk", topic_controller_1.TopicController.createBulkTopics);
TopicRoutes.post("/merge", topic_controller_1.TopicController.mergeTopics);
TopicRoutes.get("/", topic_controller_1.TopicController.getAllTopics);
TopicRoutes.get("/chapter/:chapterId", topic_controller_1.TopicController.getTopicsByChapter);
TopicRoutes.get("/:id", topic_controller_1.TopicController.getSingleTopic);
TopicRoutes.patch("/:id/move", topic_controller_1.TopicController.moveTopic);
TopicRoutes.patch("/:id", topic_controller_1.TopicController.updateTopic);
TopicRoutes.delete("/:id", topic_controller_1.TopicController.deleteTopic);
TopicRoutes.delete("/", topic_controller_1.TopicController.deleteAllTopic);
exports.default = TopicRoutes;
//# sourceMappingURL=topic.route.js.map