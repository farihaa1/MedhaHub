import { Router } from "express";
import { ModelTestController } from "./modelTest.controller";
import {
  createModelTestValidationSchema,
  updateModelTestValidationSchema,
} from "./modelTest.validation";
import validateRequest from "../../utils/validateRequest";

const ModelTestRoutes = Router();

ModelTestRoutes.post(
  "/",
  validateRequest(createModelTestValidationSchema),
  ModelTestController.createModelTest,
);

ModelTestRoutes.get("/", ModelTestController.getAllModelTests);

ModelTestRoutes.get("/:id", ModelTestController.getSingleModelTest);

ModelTestRoutes.patch(
  "/:id",
  validateRequest(updateModelTestValidationSchema),
  ModelTestController.updateModelTest,
);

ModelTestRoutes.delete("/:id", ModelTestController.deleteModelTest);

export default ModelTestRoutes;
