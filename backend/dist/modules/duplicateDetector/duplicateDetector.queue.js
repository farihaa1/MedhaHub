"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateDetectorQueue = void 0;
exports.queueQuestionDuplicateCheck = queueQuestionDuplicateCheck;
exports.queueScopeScan = queueScopeScan;
const bullmq_1 = require("bullmq");
const connection = {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
};
exports.duplicateDetectorQueue = new bullmq_1.Queue("duplicate-detector", {
    connection,
});
async function queueQuestionDuplicateCheck(questionId) {
    await exports.duplicateDetectorQueue.add("question-check", {
        questionId,
    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 3000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
    });
}
async function queueScopeScan(scope) {
    await exports.duplicateDetectorQueue.add("scope-scan", {
        scope,
    }, {
        attempts: 2,
        removeOnComplete: 100,
        removeOnFail: 1000,
    });
}
//# sourceMappingURL=duplicateDetector.queue.js.map