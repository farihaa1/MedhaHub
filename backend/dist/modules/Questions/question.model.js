"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
const mongoose_1 = require("mongoose");
const question_constant_1 = require("./question.constant");
const question_utils_1 = require("./question.utils");
// =========================================================
// OPTION SCHEMA
// =========================================================
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
// =========================================================
// SOURCE SCHEMA
// =========================================================
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
// =========================================================
// NORMALIZE OPTION TEXT
// =========================================================
function normalizeOptionText(text) {
    return text.trim().toLowerCase().replace(/\s+/g, " ");
}
// =========================================================
// CREATE OPTION COMPARISON DATA
// =========================================================
//
// Option order does NOT matter.
//
// Example:
//
// A:
// ঢাকা
// চট্টগ্রাম
// খুলনা
// রাজশাহী
//
// B:
// খুলনা
// রাজশাহী
// ঢাকা
// চট্টগ্রাম
//
// Both are considered the same option set.
//
// isCorrect is included because the correct answer matters.
// =========================================================
function getNormalizedOptions(options) {
    return options
        .map((option) => {
        const text = normalizeOptionText(option.text);
        const correct = option.isCorrect ? "1" : "0";
        return `${text}::${correct}`;
    })
        .sort();
}
// =========================================================
// CHECK WHETHER TWO QUESTION OPTION SETS ARE IDENTICAL
// =========================================================
function areOptionsSame(first, second) {
    const firstOptions = getNormalizedOptions(first);
    const secondOptions = getNormalizedOptions(second);
    if (firstOptions.length !== secondOptions.length) {
        return false;
    }
    return firstOptions.every((value, index) => value === secondOptions[index]);
}
// =========================================================
// QUESTION SCHEMA
// =========================================================
const questionSchema = new mongoose_1.Schema({
    // =======================================================
    // CLASSIFICATION
    // =======================================================
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subject",
        required: [true, "Subject নির্বাচন করা আবশ্যক।"],
    },
    chapterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chapter",
        required: [true, "Chapter নির্বাচন করা আবশ্যক।"],
    },
    topicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Topic",
        required: [true, "Topic নির্বাচন করা আবশ্যক।"],
    },
    // =======================================================
    // QUESTION TYPE
    // =======================================================
    type: {
        type: String,
        enum: Object.values(question_constant_1.QuestionType),
        default: question_constant_1.QuestionType.MCQ,
        required: true,
    },
    // =======================================================
    // QUESTION TEXT
    // =======================================================
    questionText: {
        type: String,
        required: [true, "প্রশ্ন লিখতে হবে।"],
        trim: true,
    },
    // =======================================================
    // NORMALIZED QUESTION
    // =======================================================
    normalizedQuestion: {
        type: String,
        trim: true,
        required: true,
    },
    // =======================================================
    // QUESTION IMAGE
    // =======================================================
    questionImage: {
        type: String,
        default: null,
    },
    // =======================================================
    // OPTIONS
    // =======================================================
    options: {
        type: [optionSchema],
        required: [true, "প্রশ্নের অপশন যুক্ত করতে হবে।"],
        validate: [
            {
                validator: (value) => value.length === 4,
                message: "একটি MCQ প্রশ্নে অবশ্যই ৪টি অপশন থাকতে হবে।",
            },
            {
                validator: (value) => value.filter((option) => option.isCorrect).length === 1,
                message: "অবশ্যই একটি মাত্র সঠিক উত্তর নির্বাচন করতে হবে।",
            },
        ],
    },
    // =======================================================
    // EXPLANATION
    // =======================================================
    explanation: {
        type: String,
        trim: true,
        default: "",
    },
    explanationImage: {
        type: String,
        default: null,
    },
    // =======================================================
    // SOURCES
    // =======================================================
    sources: {
        type: [sourceSchema],
        default: [],
    },
    // =======================================================
    // DIFFICULTY
    // =======================================================
    difficulty: {
        type: String,
        enum: Object.values(question_constant_1.QuestionDifficulty),
    },
    // =======================================================
    // TAGS
    // =======================================================
    tags: {
        type: [String],
        default: [],
    },
    // =======================================================
    // CATEGORY STATUS
    // =======================================================
    isCategorized: {
        type: Boolean,
        default: false,
    },
    // =======================================================
    // WORKFLOW STATUS
    // =======================================================
    status: {
        type: String,
        enum: Object.values(question_constant_1.QuestionStatus),
        default: question_constant_1.QuestionStatus.PENDING,
    },
    // =======================================================
    // CREATOR
    // =======================================================
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "প্রশ্নটি কে তৈরি করেছেন তা উল্লেখ করা আবশ্যক।"],
    },
    // =======================================================
    // APPROVAL
    // =======================================================
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
// =========================================================
// NORMALIZE BEFORE SAVE
// =========================================================
questionSchema.pre("save", async function (next) {
    try {
        // -------------------------------------------------------
        // Generate normalized question
        // -------------------------------------------------------
        if (this.isModified("questionText")) {
            this.normalizedQuestion = (0, question_utils_1.normalizeQuestion)(this.questionText);
        }
        // -------------------------------------------------------
        // Only perform duplicate check for new documents
        // or when question/options are modified.
        // -------------------------------------------------------
        if (this.isNew ||
            this.isModified("questionText") ||
            this.isModified("options")) {
            const existingQuestion = await exports.Question.findOne({
                normalizedQuestion: this.normalizedQuestion,
                type: this.type,
                _id: { $ne: this._id },
            }).lean();
            if (existingQuestion) {
                const sameOptions = areOptionsSame(this.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                })), existingQuestion.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                })));
                if (sameOptions) {
                    const error = new Error("এই প্রশ্নটি একই অপশনসহ ইতোমধ্যে ডাটাবেজে বিদ্যমান।");
                    return next(error);
                }
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
// =========================================================
// NORMALIZE BEFORE INSERT MANY
// =========================================================
//
// IMPORTANT:
//
// insertMany() does not execute save middleware.
// Therefore duplicate checking must happen here separately.
// =========================================================
questionSchema.pre("insertMany", async function (next, docs) {
    try {
        // -------------------------------------------------------
        // Normalize all incoming questions
        // -------------------------------------------------------
        for (const doc of docs) {
            if (doc.questionText) {
                doc.normalizedQuestion = (0, question_utils_1.normalizeQuestion)(doc.questionText);
            }
        }
        // -------------------------------------------------------
        // Check each incoming question against database
        // -------------------------------------------------------
        for (const doc of docs) {
            const existingQuestions = await exports.Question.find({
                normalizedQuestion: doc.normalizedQuestion,
                type: doc.type,
            }).lean();
            for (const existingQuestion of existingQuestions) {
                const sameOptions = areOptionsSame(doc.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                })), existingQuestion.options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                })));
                if (sameOptions) {
                    return next(new Error(`এই প্রশ্নটি একই অপশনসহ ইতোমধ্যে ডাটাবেজে বিদ্যমান: ${doc.questionText}`));
                }
            }
        }
        // -------------------------------------------------------
        // Check duplicates inside the same insertMany batch
        // -------------------------------------------------------
        for (let i = 0; i < docs.length; i++) {
            for (let j = i + 1; j < docs.length; j++) {
                if (docs[i].normalizedQuestion !== docs[j].normalizedQuestion ||
                    docs[i].type !== docs[j].type) {
                    continue;
                }
                const sameOptions = areOptionsSame(docs[i].options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                })), docs[j].options.map((option) => ({
                    text: option.text,
                    isCorrect: option.isCorrect,
                })));
                if (sameOptions) {
                    return next(new Error(`একই batch-এর মধ্যে duplicate প্রশ্ন পাওয়া গেছে: ${docs[i].questionText}`));
                }
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
// =========================================================
// INDEXES
// =========================================================
// Full text search
questionSchema.index({
    questionText: "text",
});
// Normalized question lookup
//
// NOT UNIQUE.
//
// Multiple questions may have the same question text
// when their options are different.
//
questionSchema.index({
    normalizedQuestion: 1,
});
// Academic hierarchy
questionSchema.index({
    subjectId: 1,
    chapterId: 1,
    topicId: 1,
});
// =========================================================
// SOURCE INDEX
// =========================================================
questionSchema.index({
    "sources.type": 1,
    "sources.year": 1,
});
// =========================================================
// DIFFICULTY INDEX
// =========================================================
questionSchema.index({
    difficulty: 1,
});
// =========================================================
// STATUS INDEX
// =========================================================
questionSchema.index({
    status: 1,
});
// =========================================================
// TAGS INDEX
// =========================================================
questionSchema.index({
    tags: 1,
});
// =========================================================
// MODEL
// =========================================================
exports.Question = (0, mongoose_1.model)("Question", questionSchema);
//# sourceMappingURL=question.model.js.map