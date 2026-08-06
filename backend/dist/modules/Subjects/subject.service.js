"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const chapter_model_1 = require("../Chapters/chapter.model");
const subject_model_1 = require("./subject.model");
const createSubject = async (payload) => {
    const result = await subject_model_1.Subject.create(payload);
    return result;
};
const getAllSubjects = async () => {
    console.log("SERVICE START");
    console.log("Before Subject.find()");
    const result = await subject_model_1.Subject.find().sort({ title: 1 });
    console.log("After Subject.find()");
    return result;
};
const getSingleSubject = async (slug) => {
    return await subject_model_1.Subject.findOne({ slug });
};
const updateSubject = async (slug, payload) => {
    return await subject_model_1.Subject.findOneAndUpdate({ slug }, payload, {
        new: true,
        runValidators: true,
    });
};
const deleteSubject = async (slug) => {
    const chapterCount = await chapter_model_1.Chapter.countDocuments({ slug: slug });
    if (chapterCount > 0) {
        throw new AppError_1.default(400, "Cannot delete subject because it contains chapters.");
    }
    return await subject_model_1.Subject.findOneAndDelete({ slug });
};
exports.SubjectService = {
    createSubject,
    getAllSubjects,
    getSingleSubject,
    updateSubject,
    deleteSubject,
};
//# sourceMappingURL=subject.service.js.map