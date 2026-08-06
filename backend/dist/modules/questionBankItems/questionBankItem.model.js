"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBankItem = void 0;
const mongoose_1 = require("mongoose");
const questionBankItemSchema = new mongoose_1.Schema({
    questionBank: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "QuestionBank",
        required: true,
    },
    question: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    order: {
        type: Number,
        required: true,
        min: 1,
    },
    marks: {
        type: Number,
        default: 1,
        min: 0,
    },
    negativeMarks: {
        type: Number,
        default: 0,
        min: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
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
/* ===================================================
   Indexes
=================================================== */
// Prevent duplicate questions inside one bank
questionBankItemSchema.index({
    questionBank: 1,
    question: 1,
}, {
    unique: true,
});
// Fast ordering
questionBankItemSchema.index({
    questionBank: 1,
    order: 1,
});
// Fast lookup
questionBankItemSchema.index({
    question: 1,
});
/* ===================================================
   Static Methods
=================================================== */
questionBankItemSchema.statics.isQuestionExistsInBank = async function (questionBank, question) {
    return this.findOne({
        questionBank,
        question,
    });
};
/* ===================================================
   Model
=================================================== */
exports.QuestionBankItem = (0, mongoose_1.model)("QuestionBankItem", questionBankItemSchema);
//# sourceMappingURL=questionBankItem.model.js.map