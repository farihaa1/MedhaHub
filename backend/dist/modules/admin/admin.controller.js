"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const admin_service_1 = require("./admin.service");
const getDashboard = (0, catchAsync_1.catchAsync)(async (_req, res) => {
    const result = await admin_service_1.AdminService.getDashboard();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Dashboard fetched successfully",
        data: result,
    });
});
exports.AdminController = {
    getDashboard,
};
//# sourceMappingURL=admin.controller.js.map