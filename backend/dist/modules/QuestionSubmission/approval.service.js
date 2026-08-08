"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveSubmission = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const questionSubmission_model_1 = require("./questionSubmission.model");
const questionSubmission_constant_1 = require("./questionSubmission.constant");
const question_model_1 = require("../Questions/question.model");
const user_model_1 = require("../users/user.model");
const chapter_model_1 = require("../Chapters/chapter.model");
const topic_model_1 = require("../Topics/topic.model");
const duplicateDetector_service_1 = __importDefault(require("../duplicateDetector/duplicateDetector.service"));
const approveSubmission = async (submissionId, adminId, reviewComment) => {
    const session = await mongoose_1.default.startSession();
    let approvedQuestionId;
    try {
        await session.startTransaction();
        /**
         * ==========================================================
         * FIND SUBMISSION
         * ==========================================================
         */
        const submission = await questionSubmission_model_1.QuestionSubmission.findById(submissionId).session(session);
        if (!submission) {
            throw new AppError_1.default(404, "Submission not found");
        }
        if (submission.status !== questionSubmission_constant_1.SubmissionStatus.PENDING) {
            throw new AppError_1.default(400, "Submission already reviewed");
        }
        /**
         * ==========================================================
         * RESOLVE CHAPTER
         * ==========================================================
         */
        let chapterId = submission.chapterId;
        if (!chapterId && submission.suggestedChapterTitle) {
            const existingChapter = await chapter_model_1.Chapter.findOne({
                subjectId: submission.subjectId,
                title: submission.suggestedChapterTitle,
            }).session(session);
            if (existingChapter) {
                chapterId = existingChapter._id;
            }
            else {
                const [chapter] = await chapter_model_1.Chapter.create([
                    {
                        subjectId: submission.subjectId,
                        title: submission.suggestedChapterTitle,
                    },
                ], {
                    session,
                });
                chapterId = chapter._id;
            }
        }
        if (!chapterId) {
            throw new AppError_1.default(400, "Chapter not found");
        }
        /**
         * ==========================================================
         * RESOLVE TOPIC
         * ==========================================================
         */
        let topicId = submission.topicId;
        if (!topicId && submission.suggestedTopicTitle) {
            const existingTopic = await topic_model_1.Topic.findOne({
                chapterId,
                title: submission.suggestedTopicTitle,
            }).session(session);
            if (existingTopic) {
                topicId = existingTopic._id;
            }
            else {
                const [topic] = await topic_model_1.Topic.create([
                    {
                        chapterId,
                        title: submission.suggestedTopicTitle,
                    },
                ], {
                    session,
                });
                topicId = topic._id;
            }
        }
        if (!topicId) {
            throw new AppError_1.default(400, "Topic not found");
        }
        /**
         * ==========================================================
         * CONVERT OPTIONS
         *
         * Submission:
         *
         * {
         *   label: "A",
         *   text: "..."
         * }
         *
         * Question:
         *
         * {
         *   text: "...",
         *   isCorrect: true
         * }
         * ==========================================================
         */
        const questionOptions = submission.options.map((option) => ({
            text: option.text,
            image: option.image || null,
            isCorrect: option.label === submission.correctAnswer,
        }));
        /**
         * ==========================================================
         * NEW QUESTION
         * ==========================================================
         */
        let question;
        if (submission.submissionType === questionSubmission_constant_1.SubmissionType.NEW) {
            const [createdQuestion] = await question_model_1.Question.create([
                {
                    subjectId: submission.subjectId,
                    chapterId,
                    topicId,
                    questionText: submission.questionText,
                    options: questionOptions,
                    explanation: submission.explanation || "",
                    tags: submission.tags || [],
                    createdBy: submission.submittedBy,
                    approvedBy: adminId,
                    approvedAt: new Date(),
                },
            ], {
                session,
            });
            question = createdQuestion;
        }
        /**
         * ==========================================================
         * UPDATE QUESTION
         * ==========================================================
         */
        if (submission.submissionType === questionSubmission_constant_1.SubmissionType.UPDATE) {
            if (!submission.existingQuestionId) {
                throw new AppError_1.default(400, "Existing question ID is required");
            }
            question = await question_model_1.Question.findByIdAndUpdate(submission.existingQuestionId, {
                $set: {
                    subjectId: submission.subjectId,
                    chapterId,
                    topicId,
                    questionText: submission.questionText,
                    options: questionOptions,
                    explanation: submission.explanation || "",
                    tags: submission.tags || [],
                    approvedBy: adminId,
                    approvedAt: new Date(),
                },
            }, {
                new: true,
                runValidators: true,
                session,
            });
            if (!question) {
                throw new AppError_1.default(404, "Question not found");
            }
        }
        if (!question) {
            throw new AppError_1.default(500, "Question could not be created or updated");
        }
        approvedQuestionId = question._id;
        /**
         * ==========================================================
         * UPDATE SUBMISSION
         * ==========================================================
         */
        submission.status = questionSubmission_constant_1.SubmissionStatus.APPROVED;
        submission.reviewedBy = adminId;
        submission.reviewedAt = new Date();
        submission.reviewComment = reviewComment || "";
        submission.chapterId = chapterId;
        submission.topicId = topicId;
        submission.approvedQuestionId = question._id;
        await submission.save({
            session,
        });
        /**
         * ==========================================================
         * REWARD CONTRIBUTOR
         * ==========================================================
         */
        await user_model_1.User.findByIdAndUpdate(submission.submittedBy, {
            $inc: {
                points: questionSubmission_constant_1.CONTRIBUTOR_REWARD,
            },
        }, {
            session,
        });
        /**
         * ==========================================================
         * COMMIT DATABASE TRANSACTION
         * ==========================================================
         */
        await session.commitTransaction();
        /**
         * ==========================================================
         * DUPLICATE DETECTION
         *
         * We intentionally run this AFTER the transaction.
         *
         * DuplicateDetector uses its own database operations.
         * ==========================================================
         */
        let duplicateDetection = null;
        try {
            duplicateDetection = await duplicateDetector_service_1.default.indexQuestion(question._id.toString());
        }
        catch (duplicateError) {
            console.error("Duplicate detection failed:", duplicateError);
            duplicateDetection = {
                error: "Duplicate detection failed after approval",
            };
        }
        /**
         * ==========================================================
         * POPULATE
         * ==========================================================
         */
        await submission.populate([
            {
                path: "subjectId",
            },
            {
                path: "chapterId",
            },
            {
                path: "topicId",
            },
            {
                path: "submittedBy",
            },
            {
                path: "reviewedBy",
            },
            {
                path: "approvedQuestionId",
            },
        ]);
        return {
            success: true,
            reward: questionSubmission_constant_1.CONTRIBUTOR_REWARD,
            submission,
            question,
            duplicateDetection,
        };
    }
    catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        throw error;
    }
    finally {
        await session.endSession();
    }
};
exports.approveSubmission = approveSubmission;
//# sourceMappingURL=approval.service.js.map