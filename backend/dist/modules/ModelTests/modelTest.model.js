"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModelTest = void 0;
const mongoose_1 = require("mongoose");
const modelTest_constant_1 = require("./modelTest.constant");
const modelTest_utils_1 = require("./modelTest.utils");
const modelTestSchema = new mongoose_1.Schema({
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
    },
    description: String,
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
            message: "At least one question is required.",
        },
    },
    settings: {
        duration: {
            type: Number,
            required: true,
            min: 1,
        },
        negativeMark: {
            type: Number,
            default: 0,
        },
        shuffleQuestions: {
            type: Boolean,
            default: false,
        },
        shuffleOptions: {
            type: Boolean,
            default: false,
        },
    },
    schedule: {
        startDate: Date,
        endDate: Date,
    },
    visibility: {
        type: String,
        enum: Object.values(modelTest_constant_1.ModelTestVisibility),
        default: modelTest_constant_1.ModelTestVisibility.PUBLIC,
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: Object.values(modelTest_constant_1.ModelTestStatus),
        default: modelTest_constant_1.ModelTestStatus.DRAFT,
    },
    tags: [String],
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
modelTestSchema.index({ status: 1 });
modelTestSchema.index({ visibility: 1 });
modelTestSchema.index({ isPremium: 1 });
modelTestSchema.pre("validate", function () {
    if (!this.slug && this.title) {
        this.slug = (0, modelTest_utils_1.generateSlug)(this.title);
    }
});
exports.ModelTest = (0, mongoose_1.model)("ModelTest", modelTestSchema);
//# sourceMappingURL=modelTest.model.js.map