"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const practiceSet_controller_1 = require("./practiceSet.controller");
const practiceSet_validation_1 = require("./practiceSet.validation");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const PracticeSetRoutes = (0, express_1.Router)();
PracticeSetRoutes.post("/", (0, validateRequest_1.default)(practiceSet_validation_1.createPracticeSetValidationSchema), practiceSet_controller_1.PracticeSetController.createPracticeSet);
PracticeSetRoutes.get("/", practiceSet_controller_1.PracticeSetController.getAllPracticeSets);
PracticeSetRoutes.get("/:id", practiceSet_controller_1.PracticeSetController.getSinglePracticeSet);
PracticeSetRoutes.patch("/:id", (0, validateRequest_1.default)(practiceSet_validation_1.updatePracticeSetValidationSchema), practiceSet_controller_1.PracticeSetController.updatePracticeSet);
PracticeSetRoutes.delete("/:id", practiceSet_controller_1.PracticeSetController.deletePracticeSet);
exports.default = PracticeSetRoutes;
//# sourceMappingURL=practiceSet.route.js.map