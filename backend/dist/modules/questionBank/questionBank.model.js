"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBank = void 0;
const mongoose_1 = require("mongoose");
const questionBank_constant_1 = require("./questionBank.constant");
const questionBankSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Question bank title is required"],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, "Slug is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    category: {
        type: String,
        enum: questionBank_constant_1.QUESTION_BANK_CATEGORY,
        required: true,
    },
    year: {
        type: Number,
        min: 1900,
        max: 2100,
    },
    paper: {
        type: String,
        enum: questionBank_constant_1.QUESTION_BANK_PAPER,
    },
    organization: {
        type: String,
        trim: true,
        default: "",
    },
    description: {
        type: String,
        trim: true,
        default: "",
    },
    visibility: {
        type: String,
        enum: questionBank_constant_1.QUESTION_BANK_VISIBILITY,
        default: "PUBLIC",
    },
    totalQuestions: {
        type: Number,
        default: 0,
        min: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    deletedAt: {
        type: Date,
        default: null,
    },
    deletedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
/* ======================================================
   Indexes
====================================================== */
questionBankSchema.index({
    category: 1,
    year: -1,
});
questionBankSchema.index({
    category: 1,
    paper: 1,
});
questionBankSchema.index({
    visibility: 1,
    isPublished: 1,
});
questionBankSchema.index({
    title: "text",
    organization: "text",
    description: "text",
});
/* ======================================================
   Static Methods
====================================================== */
questionBankSchema.statics.isSlugExists = async function (slug) {
    return this.findOne({
        slug,
        isDeleted: false,
    });
};
/* ======================================================
   Query Middleware
====================================================== */
function excludeDeleted() {
    this.where({
        isDeleted: false,
    });
}
questionBankSchema.pre("find", excludeDeleted);
questionBankSchema.pre("findOne", excludeDeleted);
questionBankSchema.pre("findOneAndUpdate", excludeDeleted);
/* ======================================================
   Model
====================================================== */
exports.QuestionBank = (0, mongoose_1.model)("QuestionBank", questionBankSchema);
//# sourceMappingURL=questionBank.model.js.map