"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chapter = void 0;
const mongoose_1 = require("mongoose");
const chapter_constant_1 = require("./chapter.constant");
const chapterSchema = new mongoose_1.Schema({
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        trim: true,
    },
    order: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: Object.values(chapter_constant_1.ChapterStatus),
        default: chapter_constant_1.ChapterStatus.DRAFT,
    },
    totalTopics: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalQuestions: {
        type: Number,
        default: 0,
        min: 0,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
chapterSchema.index({
    subjectId: 1,
    slug: 1,
}, {
    unique: true,
});
exports.Chapter = (0, mongoose_1.model)("Chapter", chapterSchema);
//# sourceMappingURL=chapter.model.js.map