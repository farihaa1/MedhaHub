"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subject = void 0;
const mongoose_1 = require("mongoose");
const subject_constrain_1 = require("./subject.constrain");
const subjectSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        enum: Object.values(subject_constrain_1.SubjectSlug),
    },
    url: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});
exports.Subject = (0, mongoose_1.model)("Subject", subjectSchema);
//# sourceMappingURL=subject.model.js.map