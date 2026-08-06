"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeSetService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const practiceSet_model_1 = require("./practiceSet.model");
const http_status_1 = __importDefault(require("http-status"));
const createPracticeSet = async (payload) => {
    const exists = await practiceSet_model_1.PracticeSet.findOne({
        $or: [{ title: payload.title }, { slug: payload.slug }],
    });
    if (exists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "Practice set already exists.");
    }
    return await practiceSet_model_1.PracticeSet.create(payload);
};
const getAllPracticeSets = async () => {
    return await practiceSet_model_1.PracticeSet.find()
        .populate("subject")
        .populate("chapter")
        .populate("topics")
        .lean();
};
const getSinglePracticeSet = async (id) => {
    const practiceSet = await practiceSet_model_1.PracticeSet.findById(id)
        .populate("subject")
        .populate("chapter")
        .populate("topics")
        .populate("questions");
    if (!practiceSet) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Practice set not found.");
    }
    return practiceSet;
};
const updatePracticeSet = async (id, payload) => {
    const practiceSet = await practiceSet_model_1.PracticeSet.findById(id);
    if (!practiceSet) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Practice set not found.");
    }
    return await practiceSet_model_1.PracticeSet.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
};
const deletePracticeSet = async (id) => {
    const practiceSet = await practiceSet_model_1.PracticeSet.findById(id);
    if (!practiceSet) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Practice set not found.");
    }
    await practiceSet_model_1.PracticeSet.findByIdAndDelete(id);
    return null;
};
exports.PracticeSetService = {
    createPracticeSet,
    getAllPracticeSets,
    getSinglePracticeSet,
    updatePracticeSet,
    deletePracticeSet,
};
//# sourceMappingURL=practiceSet.service.js.map