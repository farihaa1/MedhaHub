"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PracticeSet = void 0;
const mongoose_1 = require("mongoose");
const practiceSet_constant_1 = require("./practiceSet.constant");
const practiceSet_utils_1 = require("./practiceSet.utils");
const practiceSetSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
    },
    slug: {
        type: String,
        unique: true,
        index: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    subject: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subject",
        required: true,
    },
    chapter: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chapter",
    },
    topics: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Topic",
        },
    ],
    questions: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Question",
            },
        ],
        required: true,
        validate: {
            validator: (value) => value.length > 0,
            message: "Practice set must contain at least one question.",
        },
    },
    settings: {
        duration: {
            type: Number,
            min: 1,
        },
        negativeMark: {
            type: Number,
            default: 0,
            min: 0,
        },
        shuffleQuestions: {
            type: Boolean,
            default: true,
        },
        shuffleOptions: {
            type: Boolean,
            default: true,
        },
    },
    visibility: {
        type: String,
        enum: Object.values(practiceSet_constant_1.PracticeSetVisibility),
        default: practiceSet_constant_1.PracticeSetVisibility.PUBLIC,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: Object.values(practiceSet_constant_1.PracticeSetStatus),
        default: practiceSet_constant_1.PracticeSetStatus.DRAFT,
    },
    tags: [
        {
            type: String,
            trim: true,
        },
    ],
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
    versionKey: false,
});
/* ---------------------------------
   Indexes
---------------------------------- */
practiceSetSchema.index({ subject: 1 });
practiceSetSchema.index({ chapter: 1 });
practiceSetSchema.index({ topics: 1 });
practiceSetSchema.index({ status: 1 });
practiceSetSchema.index({ visibility: 1 });
practiceSetSchema.index({ isPremium: 1 });
/* ---------------------------------
   Middleware
---------------------------------- */
practiceSetSchema.pre("validate", function () {
    if (!this.slug && this.title) {
        this.slug = (0, practiceSet_utils_1.generateSlug)(this.title);
    }
});
exports.PracticeSet = (0, mongoose_1.model)("PracticeSet", practiceSetSchema);
//# sourceMappingURL=practiceSet.model.js.map