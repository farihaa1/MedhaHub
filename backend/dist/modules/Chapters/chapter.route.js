"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapter_controller_1 = require("./chapter.controller");
const topic_controller_1 = require("../Topics/topic.controller");
const ChapterRoutes = (0, express_1.Router)();
// Create
ChapterRoutes.post("/", chapter_controller_1.ChapterController.createChapter);
// Read
ChapterRoutes.get("/", chapter_controller_1.ChapterController.getAllChapters);
// Single chapter
ChapterRoutes.get("/:id", chapter_controller_1.ChapterController.getSingleChapter);
// Update
ChapterRoutes.patch("/:id", chapter_controller_1.ChapterController.updateChapter);
// Delete
ChapterRoutes.delete("/:id", chapter_controller_1.ChapterController.deleteChapter);
ChapterRoutes.get("/:chapterId/topics", topic_controller_1.TopicController.getTopicsByChapter);
exports.default = ChapterRoutes;
//# sourceMappingURL=chapter.route.js.map