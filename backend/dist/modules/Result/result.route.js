"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const result_controller_1 = require("./result.controller");
const ResultRoutes = express_1.default.Router();
ResultRoutes.get("/:sessionId", result_controller_1.ResultController.getResult);
exports.default = ResultRoutes;
//# sourceMappingURL=result.route.js.map