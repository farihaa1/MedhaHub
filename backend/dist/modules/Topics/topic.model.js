"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Topic = void 0;
const mongoose_1 = require("mongoose");
const topic_interface_1 = require("./topic.interface");
const topicSchema = new mongoose_1.Schema({
    chapterId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Chapter",
        required: true,
    },
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
        lowercase: true,
    },
    order: {
        type: Number,
        required: true,
        min: 1,
    },
    status: {
        type: String,
        enum: Object.values(topic_interface_1.TopicStatus),
        default: topic_interface_1.TopicStatus.Draft,
    },
    totalQuestions: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
topicSchema.index({
    chapterId: 1,
    slug: 1,
}, {
    unique: true,
});
topicSchema.index({
    chapterId: 1,
    order: 1,
}, {
    unique: true,
});
exports.Topic = (0, mongoose_1.model)("Topic", topicSchema);
//# sourceMappingURL=topic.model.js.map