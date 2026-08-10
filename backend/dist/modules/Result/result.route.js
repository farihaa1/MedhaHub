"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constants_1 = require("../users/user.constants");
const result_controller_1 = require("./result.controller");
const ResultRoutes = (0, express_1.Router)();
// ============================================================
// GET RESULT REVIEW
// GET /api/v1/result/:sessionId
// ============================================================
ResultRoutes.get("/:sessionId", (0, auth_1.default)(user_constants_1.UserRole.USER, user_constants_1.UserRole.ADMIN), result_controller_1.ResultController.getResultReview);
exports.default = ResultRoutes;
//# sourceMappingURL=result.route.js.map