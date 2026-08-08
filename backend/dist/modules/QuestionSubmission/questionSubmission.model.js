"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionSubmission = void 0;
const mongoose_1 = require("mongoose");
const questionSubmission_constant_1 = require("./questionSubmission.constant");
const submissionOptionSchema = new mongoose_1.Schema({
    label: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
    },
    text: {
        type: String,
        required: [true, "অপশনের লেখা আবশ্যক।"],
        trim: true,
    },
    image: {
        type: String,
        default: null,
    },
}, {
    _id: true,
});
const questionSubmissionSchema = new mongoose_1.Schema({
    submissionType: {
        type: String,
        enum: Object.values(questionSubmission_constant_1.SubmissionType),
        required: true,
    },
    existingQuestionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
    },
    approvedQuestionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Question",
    },
    subjectId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    chapterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chapter",
    },
    suggestedChapterTitle: {
        type: String,
        trim: true,
    },
    topicId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Topic",
    },
    suggestedTopicTitle: {
        type: String,
        trim: true,
    },
    questionText: {
        type: String,
        required: true,
        trim: true,
    },
    options: {
        type: [submissionOptionSchema],
        required: true,
        validate: [
            {
                validator: (value) => value.length === 4,
                message: "A question must contain exactly 4 options.",
            },
        ],
    },
    correctAnswer: {
        type: String,
        enum: ["A", "B", "C", "D"],
        required: true,
    },
    explanation: {
        type: String,
        default: "",
        trim: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    status: {
        type: String,
        enum: Object.values(questionSubmission_constant_1.SubmissionStatus),
        default: questionSubmission_constant_1.SubmissionStatus.PENDING,
    },
    submittedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    reviewedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    reviewedAt: {
        type: Date,
    },
    reviewComment: {
        type: String,
        default: "",
        trim: true,
    },
}, {
    timestamps: true,
});
/**
 * ============================================================
 * CUSTOM VALIDATION
 * ============================================================
 */
questionSubmissionSchema.pre("validate", function () {
    /**
     * UPDATE
     */
    if (this.submissionType === questionSubmission_constant_1.SubmissionType.UPDATE &&
        !this.existingQuestionId) {
        throw new Error("existingQuestionId is required for UPDATE submission");
    }
    /**
     * NEW
     */
    if (this.submissionType === questionSubmission_constant_1.SubmissionType.NEW && this.existingQuestionId) {
        throw new Error("existingQuestionId is only allowed for UPDATE submission");
    }
    /**
     * Chapter
     */
    if (!this.chapterId && !this.suggestedChapterTitle) {
        throw new Error("Either chapterId or suggestedChapterTitle is required");
    }
    /**
     * Topic
     */
    if (!this.topicId && !this.suggestedTopicTitle) {
        throw new Error("Either topicId or suggestedTopicTitle is required");
    }
    /**
     * Cannot provide both chapter options
     */
    if (this.chapterId && this.suggestedChapterTitle) {
        throw new Error("Provide either chapterId or suggestedChapterTitle, not both.");
    }
    /**
     * Cannot provide both topic options
     */
    if (this.topicId && this.suggestedTopicTitle) {
        throw new Error("Provide either topicId or suggestedTopicTitle, not both.");
    }
});
/**
 * ============================================================
 * INDEXES
 * ============================================================
 */
questionSubmissionSchema.index({
    status: 1,
    createdAt: -1,
});
questionSubmissionSchema.index({
    submittedBy: 1,
    createdAt: -1,
});
questionSubmissionSchema.index({
    subjectId: 1,
});
questionSubmissionSchema.index({
    existingQuestionId: 1,
});
questionSubmissionSchema.index({
    approvedQuestionId: 1,
});
exports.QuestionSubmission = (0, mongoose_1.model)("QuestionSubmission", questionSubmissionSchema);
//# sourceMappingURL=questionSubmission.model.js.map