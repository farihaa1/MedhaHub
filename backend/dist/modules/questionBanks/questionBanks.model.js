"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionBanks = void 0;
const mongoose_1 = require("mongoose");
const questionBanks_constant_1 = require("./questionBanks.constant");
const questionBanksSchema = new mongoose_1.Schema({
    /* ==========================================================
       Basic Information
    ========================================================== */
    title: {
        type: String,
        required: [true, "Question bank title is required"],
        trim: true,
        minlength: 3,
        maxlength: 200,
    },
    description: {
        type: String,
        trim: true,
        default: "",
        maxlength: 2000,
    },
    slug: {
        type: String,
        trim: true,
        lowercase: true,
        default: null,
    },
    category: {
        type: String,
        enum: questionBanks_constant_1.QUESTION_BANKS_CATEGORY,
        required: true,
        index: true,
    },
    organization: {
        type: String,
        trim: true,
        default: "",
    },
    year: {
        type: Number,
        min: 1900,
        max: 2100,
        index: true,
    },
    paper: {
        type: String,
        enum: questionBanks_constant_1.QUESTION_BANKS_PAPER,
        index: true,
    },
    visibility: {
        type: String,
        enum: Object.values(questionBanks_constant_1.QuestionBanksVisibility),
        default: questionBanks_constant_1.QuestionBanksVisibility.PUBLIC,
        index: true,
    },
    /* ==========================================================
       Statistics
    ========================================================== */
    totalQuestions: {
        type: Number,
        default: 0,
        min: 0,
    },
    isPremium: {
        type: Boolean,
        default: false,
        index: true,
    },
    /* ==========================================================
       Workflow
    ========================================================== */
    status: {
        type: String,
        enum: questionBanks_constant_1.QUESTION_BANKS_STATUS,
        default: questionBanks_constant_1.QuestionBanksStatus.REVIEW,
        index: true,
    },
    reviewRemark: {
        type: String,
        trim: true,
        default: "",
        maxlength: 1000,
    },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    approvedAt: {
        type: Date,
        default: null,
    },
    publishedAt: {
        type: Date,
        default: null,
    },
    /* ==========================================================
       Soft Delete
    ========================================================== */
    isDeleted: {
        type: Boolean,
        default: false,
        index: true,
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
    restoredAt: {
        type: Date,
        default: null,
    },
    restoredBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    /* ==========================================================
       Audit
    ========================================================== */
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
}, {
    timestamps: true,
    versionKey: false,
});
/* ==========================================================
   Compound Indexes
========================================================== */
questionBanksSchema.index({
    category: 1,
    year: -1,
});
questionBanksSchema.index({
    category: 1,
    paper: 1,
});
questionBanksSchema.index({
    category: 1,
    status: 1,
});
questionBanksSchema.index({
    category: 1,
    status: 1,
    year: -1,
});
questionBanksSchema.index({
    category: 1,
    organization: 1,
});
questionBanksSchema.index({
    status: 1,
    year: -1,
});
questionBanksSchema.index({
    isPremium: 1,
    status: 1,
});
questionBanksSchema.index({
    createdBy: 1,
    createdAt: -1,
});
/* ==========================================================
   Slug Index

   Multiple null values are allowed.
   Only actual string slugs must be unique.
========================================================== */
questionBanksSchema.index({
    slug: 1,
}, {
    unique: true,
    partialFilterExpression: {
        slug: {
            $type: "string",
        },
    },
});
/* ==========================================================
   Text Search
========================================================== */
questionBanksSchema.index({
    title: "text",
    organization: "text",
    description: "text",
});
/* ==========================================================
   Static Methods
========================================================== */
questionBanksSchema.statics.isSlugExists = function (slug) {
    return this.findOne({
        slug: slug.trim().toLowerCase(),
        isDeleted: false,
    });
};
questionBanksSchema.statics.countPublished = function () {
    return this.countDocuments({
        status: questionBanks_constant_1.QuestionBanksStatus.PUBLISHED,
        isDeleted: false,
    });
};
/* ==========================================================
   Query Middleware

   Automatically hide soft deleted records.
========================================================== */
function excludeDeleted() {
    this.where({
        isDeleted: false,
    });
}
questionBanksSchema.pre("find", excludeDeleted);
questionBanksSchema.pre("findOne", excludeDeleted);
questionBanksSchema.pre("findOneAndUpdate", excludeDeleted);
questionBanksSchema.pre("countDocuments", excludeDeleted);
/* ==========================================================
   Model Export
========================================================== */
exports.QuestionBanks = (0, mongoose_1.model)("QuestionBanks", questionBanksSchema);
//# sourceMappingURL=questionBanks.model.js.map