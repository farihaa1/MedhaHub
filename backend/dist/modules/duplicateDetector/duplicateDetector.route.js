"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const duplicateDetector_controller_1 = require("./duplicateDetector.controller");
const duplicateRoutes = (0, express_1.Router)();
duplicateRoutes.get("/stats", duplicateDetector_controller_1.DuplicateDetectorController.getStats);
duplicateRoutes.get("/pairs", duplicateDetector_controller_1.DuplicateDetectorController.getPairs);
duplicateRoutes.post("/scan", duplicateDetector_controller_1.DuplicateDetectorController.scan);
duplicateRoutes.post("/question/:questionId", duplicateDetector_controller_1.DuplicateDetectorController.checkQuestion);
duplicateRoutes.patch("/:id/review", duplicateDetector_controller_1.DuplicateDetectorController.review);
duplicateRoutes.patch("/:id/resolve", duplicateDetector_controller_1.DuplicateDetectorController.resolve);
exports.default = duplicateRoutes;
//# sourceMappingURL=duplicateDetector.route.js.map