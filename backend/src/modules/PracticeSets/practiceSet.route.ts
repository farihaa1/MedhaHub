import { Router } from "express";

import { PracticeSetController } from "./practiceSet.controller";
import {
  createPracticeSetValidationSchema,
  updatePracticeSetValidationSchema,
} from "./practiceSet.validation";
import validateRequest from "../../utils/validateRequest";

const PracticeSetRoutes = Router();

PracticeSetRoutes.post(
  "/",
  validateRequest(createPracticeSetValidationSchema),
  PracticeSetController.createPracticeSet,
);

PracticeSetRoutes.get("/", PracticeSetController.getAllPracticeSets);

PracticeSetRoutes.get("/:id", PracticeSetController.getSinglePracticeSet);

PracticeSetRoutes.patch(
  "/:id",
  validateRequest(updatePracticeSetValidationSchema),
  PracticeSetController.updatePracticeSet,
);

PracticeSetRoutes.delete("/:id", PracticeSetController.deletePracticeSet);

export default PracticeSetRoutes;
