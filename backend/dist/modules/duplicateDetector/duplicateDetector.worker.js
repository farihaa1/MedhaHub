"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateDetectorWorker = void 0;
const bullmq_1 = require("bullmq");
const duplicateDetector_service_1 = __importDefault(require("./duplicateDetector.service"));
const connection = {
    host: process.env.REDIS_HOST ?? "127.0.0.1",
    port: Number(process.env.REDIS_PORT ?? 6379),
    username: process.env.REDIS_USERNAME || undefined,
    password: process.env.REDIS_PASSWORD || undefined,
};
exports.duplicateDetectorWorker = new bullmq_1.Worker("duplicate-detector", async (job) => {
    switch (job.name) {
        case "question-check":
            return duplicateDetector_service_1.default.indexQuestion(job.data.questionId);
        case "scope-scan":
            return duplicateDetector_service_1.default.scanScope(job.data.scope);
        default:
            throw new Error(`Unknown duplicate job: ${job.name}`);
    }
}, {
    connection,
    concurrency: 5,
});
exports.duplicateDetectorWorker.on("completed", (job) => {
    console.log(`[DuplicateWorker] completed ${job.id}`);
});
exports.duplicateDetectorWorker.on("failed", (job, error) => {
    console.error(`[DuplicateWorker] failed ${job?.id}`, error);
});
//# sourceMappingURL=duplicateDetector.worker.js.map