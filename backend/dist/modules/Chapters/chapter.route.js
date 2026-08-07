"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chapter_controller_1 = require("./chapter.controller");
const topic_controller_1 = require("../Topics/topic.controller");
const user_constants_1 = require("../users/user.constants");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const ChapterRoutes = (0, express_1.Router)();
// Create
ChapterRoutes.post("/", chapter_controller_1.ChapterController.createChapter);
ChapterRoutes.post("/bulk", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), chapter_controller_1.ChapterController.createBulkChapter);
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