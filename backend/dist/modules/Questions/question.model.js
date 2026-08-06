"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const question_constant_1 = require("./question.constant");
const optionSchema = new mongoose_1.Schema({
    text: {
        type: String,
        required: [true, "অপশনের লেখা আবশ্যক।"],
        trim: true,
    },
    image: {
        type: String,
        default: null,
    },
    isCorrect: {
        type: Boolean,
        default: false,
    },
}, {
    _id: true,
});
const sourceSchema = new mongoose_1.Schema({
    type: {
        type: String,
        enum: Object.values(question_constant_1.QuestionSourceType),
        required: [true, "প্রশ্নের উৎসের ধরন নির্বাচন করা আবশ্যক।"],
    },
    name: {
        type: String,
        required: [true, "প্রশ্নের উৎসের নাম লিখতে হবে।"],
        trim: true,
    },
    year: {
        type: Number,
    },
}, {
    _id: false,
});
const questionSchema = new mongoose_1.Schema({
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subject",
        default: null,
    },
    chapterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chapter",
        default: null,
    },
    topicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Topic",
        default: null,
    },
    type: {
        type: String,
        enum: Object.values(question_constant_1.QuestionType),
        default: question_constant_1.QuestionType.MCQ,
    },
    questionText: {
        type: String,
        required: [true, "প্রশ্ন লিখতে হবে।"],
        trim: true,
    },
    normalizedQuestion: {
        type: String,
        trim: true,
    },
    questionImage: {
        type: String,
        default: null,
    },
    options: {
        type: [optionSchema],
        required: [true, "প্রশ্নের অপশন যুক্ত করতে হবে।"],
        validate: [
            {
                validator: (value) => value.length === 4,
                message: "একটি এমসিকিউ প্রশ্নে অবশ্যই ৪টি অপশন থাকতে হবে।",
            },
            {
                validator: (value) => value.filter((option) => option.isCorrect).length === 1,
                message: "অবশ্যই একটি মাত্র সঠিক উত্তর নির্বাচন করতে হবে।",
            },
        ],
    },
    explanation: {
        type: String,
        trim: true,
        default: "",
    },
    explanationImage: {
        type: String,
        default: null,
    },
    sources: {
        type: [sourceSchema],
        default: [],
    },
    difficulty: {
        type: String,
        enum: Object.values(question_constant_1.QuestionDifficulty),
    },
    tags: {
        type: [String],
        default: [],
    },
    isCategorized: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: Object.values(question_constant_1.QuestionStatus),
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "প্রশ্নটি কে তৈরি করেছেন তা উল্লেখ করা আবশ্যক।"],
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    approvedAt: {
        type: Date,
    },
}, {
    timestamps: true,
});
/* ===========================
   Indexes
=========================== */
questionSchema.index({
    questionText: "text",
});
questionSchema.index({
    normalizedQuestion: 1,
});
questionSchema.index({
    subjectId: 1,
    chapterId: 1,
    topicId: 1,
});
questionSchema.index({
    "sources.type": 1,
    "sources.year": 1,
});
questionSchema.index({
    difficulty: 1,
});
questionSchema.index({
    status: 1,
});
questionSchema.index({
    tags: 1,
});
/* ===========================
   Model
=========================== */
questionSchema.pre("save", async function () {
    this.normalizedQuestion = this.questionText
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s]/gu, "")
        .replace(/\s+/g, "")
        .trim();
});
exports.Question = (0, mongoose_1.model)("Question", questionSchema);
//# sourceMappingURL=question.model.js.map