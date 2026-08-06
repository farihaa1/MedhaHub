"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subject_controller_1 = require("./subject.controller");
const chapter_controller_1 = require("../Chapters/chapter.controller");
const SubjectRoutes = (0, express_1.Router)();
SubjectRoutes.post("/", subject_controller_1.SubjectController.createSubject);
SubjectRoutes.get("/", subject_controller_1.SubjectController.getAllSubjects);
// Get chapters by subject (must come before /:id)
SubjectRoutes.get("/:subjectId/chapters", chapter_controller_1.ChapterController.getChaptersBySubject);
SubjectRoutes.get("/:slug", subject_controller_1.SubjectController.getSingleSubject);
SubjectRoutes.patch("/:slug", subject_controller_1.SubjectController.updateSubject);
SubjectRoutes.delete("/:slug", subject_controller_1.SubjectController.deleteSubject);
exports.default = SubjectRoutes;
//# sourceMappingURL=subject.route.js.map