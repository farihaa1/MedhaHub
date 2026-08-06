"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_constants_1 = require("../users/user.constants");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const admin_controller_1 = require("./admin.controller");
const AdminDashboardRoutes = (0, express_1.Router)();
AdminDashboardRoutes.get("/dashboard", (0, auth_1.default)(user_constants_1.UserRole.ADMIN), admin_controller_1.AdminController.getDashboard);
exports.default = AdminDashboardRoutes;
//# sourceMappingURL=admin.route.js.map