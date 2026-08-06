"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = exports.updateUser = exports.getSingleUser = exports.getAllUsers = void 0;
const user_service_1 = require("./user.service");
const getAllUsers = async (req, res) => {
    const result = await user_service_1.UserService.getAllUsers();
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.getAllUsers = getAllUsers;
const getSingleUser = async (req, res) => {
    const result = await user_service_1.UserService.getSingleUser(req.params.id);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.getSingleUser = getSingleUser;
const updateUser = async (req, res) => {
    const result = await user_service_1.UserService.updateUser(req.params.id, req.body);
    res.status(200).json({
        success: true,
        data: result,
    });
};
exports.updateUser = updateUser;
exports.UserController = {
    getAllUsers: exports.getAllUsers,
    getSingleUser: exports.getSingleUser,
    updateUser: exports.updateUser,
};
//# sourceMappingURL=user.controller.js.map