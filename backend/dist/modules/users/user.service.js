"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_model_1 = require("./user.model");
const getAllUsers = async () => {
    return await user_model_1.User.find().select("-password");
};
const getSingleUser = async (id) => {
    return await user_model_1.User.findById(id).select("-password");
};
const updateUser = async (id, payload) => {
    return await user_model_1.User.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).select("-password");
};
exports.UserService = {
    getAllUsers,
    getSingleUser,
    updateUser,
};
//# sourceMappingURL=user.service.js.map