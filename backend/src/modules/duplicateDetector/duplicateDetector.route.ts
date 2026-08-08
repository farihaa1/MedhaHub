import { Router } from "express";

import { DuplicateDetectorController } from "./duplicateDetector.controller";

const duplicateRoutes = Router();
duplicateRoutes.get("/stats", DuplicateDetectorController.getStats);

duplicateRoutes.get("/pairs", DuplicateDetectorController.getPairs);

duplicateRoutes.post("/scan", DuplicateDetectorController.scan);

duplicateRoutes.post("/question/:questionId", DuplicateDetectorController.checkQuestion);

duplicateRoutes.patch("/:id/review", DuplicateDetectorController.review);

duplicateRoutes.patch("/:id/resolve", DuplicateDetectorController.resolve);

export default duplicateRoutes;
