"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelTestService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const modelTest_model_1 = require("./modelTest.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const createModelTest = async (payload) => {
    const existing = await modelTest_model_1.ModelTest.findOne({
        slug: payload.slug,
    });
    if (existing) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Model test already exists.");
    }
    return await modelTest_model_1.ModelTest.create(payload);
};
const getAllModelTests = async () => {
    return await modelTest_model_1.ModelTest.find().sort({ createdAt: -1 });
};
const getSingleModelTest = async (id) => {
    const result = await modelTest_model_1.ModelTest.findById(id).populate("questions");
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Model test not found.");
    }
    return result;
};
const updateModelTest = async (id, payload) => {
    const exists = await modelTest_model_1.ModelTest.findById(id);
    if (!exists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Model test not found.");
    }
    return await modelTest_model_1.ModelTest.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};
const deleteModelTest = async (id) => {
    const exists = await modelTest_model_1.ModelTest.findById(id);
    if (!exists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Model test not found.");
    }
    await modelTest_model_1.ModelTest.findByIdAndDelete(id);
    return null;
};
exports.ModelTestService = {
    createModelTest,
    getAllModelTests,
    getSingleModelTest,
    updateModelTest,
    deleteModelTest,
};
//# sourceMappingURL=modelTest.service.js.map