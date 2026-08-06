"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const UserRoutes = (0, express_1.Router)();
// Get all users
UserRoutes.get("/", user_controller_1.UserController.getAllUsers);
// Get single user
UserRoutes.get("/:id", user_controller_1.UserController.getSingleUser);
// Update user
UserRoutes.patch("/:id", user_controller_1.UserController.updateUser);
exports.default = UserRoutes;
//# sourceMappingURL=user.route.js.map