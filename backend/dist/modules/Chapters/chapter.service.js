"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterService = exports.createBulkChapter = void 0;
const chapter_model_1 = require("./chapter.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const createChapter = async (payload) => {
    const existing = await chapter_model_1.Chapter.findOne({
        subjectId: payload.subjectId,
        slug: payload.slug,
    });
    if (existing) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Chapter already exists");
    }
    const chapter = await chapter_model_1.Chapter.create(payload);
    return chapter.populate("subjectId", "title slug");
};
const createBulkChapter = async (payload) => {
    const chapters = await chapter_model_1.Chapter.create(payload);
    return chapters;
};
exports.createBulkChapter = createBulkChapter;
const getAllChapters = async () => {
    return await chapter_model_1.Chapter.find()
        .populate("subjectId", "title slug")
        .sort({ order: 1 });
};
const getSingleChapter = async (id) => {
    const chapter = await chapter_model_1.Chapter.findById(id).populate("subjectId", "title slug");
    if (!chapter) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Chapter not found");
    }
    return chapter;
};
const updateChapter = async (id, payload) => {
    const chapter = await chapter_model_1.Chapter.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    }).populate("subjectId", "title slug");
    if (!chapter) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Chapter not found");
    }
    return chapter;
};
const deleteChapter = async (id) => {
    const chapter = await chapter_model_1.Chapter.findByIdAndDelete(id);
    if (!chapter) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Chapter not found");
    }
    return chapter;
};
const getChaptersBySubject = async (subjectId) => {
    const chapters = await chapter_model_1.Chapter.find({
        subjectId,
    })
        .populate("subjectId", "title slug")
        .sort({
        order: 1,
    });
    return chapters;
};
exports.ChapterService = {
    createChapter,
    getAllChapters,
    getSingleChapter,
    updateChapter,
    deleteChapter,
    getChaptersBySubject, createBulkChapter: exports.createBulkChapter
};
//# sourceMappingURL=chapter.service.js.map