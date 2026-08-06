"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const modelTest_controller_1 = require("./modelTest.controller");
const modelTest_validation_1 = require("./modelTest.validation");
const validateRequest_1 = __importDefault(require("../../utils/validateRequest"));
const ModelTestRoutes = (0, express_1.Router)();
ModelTestRoutes.post("/", (0, validateRequest_1.default)(modelTest_validation_1.createModelTestValidationSchema), modelTest_controller_1.ModelTestController.createModelTest);
ModelTestRoutes.get("/", modelTest_controller_1.ModelTestController.getAllModelTests);
ModelTestRoutes.get("/:id", modelTest_controller_1.ModelTestController.getSingleModelTest);
ModelTestRoutes.patch("/:id", (0, validateRequest_1.default)(modelTest_validation_1.updateModelTestValidationSchema), modelTest_controller_1.ModelTestController.updateModelTest);
ModelTestRoutes.delete("/:id", modelTest_controller_1.ModelTestController.deleteModelTest);
exports.default = ModelTestRoutes;
//# sourceMappingURL=modelTest.route.js.map