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
const approveSubmission = async (submissionId, adminId, reviewComment) => {
    const session = await mongoose_1.default.startSession();
    try {
        await session.startTransaction();
        const submission = await questionSubmission_model_1.QuestionSubmission.findById(submissionId).session(session);
        if (!submission) {
            throw new AppError_1.default(404, "Submission not found");
        }
        if (submission.status !== questionSubmission_constant_1.SubmissionStatus.PENDING) {
            throw new AppError_1.default(400, "Submission already reviewed");
        }
        /**
         * ----------------------------------------------------
         * Resolve Chapter
         * ----------------------------------------------------
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
                ], { session });
                chapterId = chapter._id;
            }
        }
        if (!chapterId) {
            throw new AppError_1.default(400, "Chapter not found");
        }
        /**
         * ----------------------------------------------------
         * Resolve Topic
         * ----------------------------------------------------
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
                ], { session });
                topicId = topic._id;
            }
        }
        if (!topicId) {
            throw new AppError_1.default(400, "Topic not found");
        }
        const questionOptions = submission.options.map((option) => ({
            text: option.text,
            image: option.image || "",
            isCorrect: option.label === submission.correctAnswer,
        }));
        /**
         * ----------------------------------------------------
         * NEW Submission
         * ----------------------------------------------------
         */
        let question;
        if (submission.submissionType === questionSubmission_constant_1.SubmissionType.NEW) {
            // [question] = await Question.create(
            //   [
            //     {
            //       subjectId: submission.subjectId,
            //       chapterId,
            //       topicId,
            //       questionText: submission.questionText,
            //       options: questionOptions,
            //       correctAnswer: submission.correctAnswer,
            //       explanation: submission.explanation,
            //       tags: submission.tags,
            //       createdBy: submission.submittedBy,
            //     },
            //   ],
            //   {
            //     session,
            //   },
            // );
        }
        /**
         * ----------------------------------------------------
         * UPDATE Submission
         * ----------------------------------------------------
         */
        if (submission.submissionType === questionSubmission_constant_1.SubmissionType.UPDATE) {
            question = await question_model_1.Question.findByIdAndUpdate(submission.existingQuestionId, {
                subjectId: submission.subjectId,
                chapterId,
                topicId,
                questionText: submission.questionText,
                options: submission.options,
                correctAnswer: submission.correctAnswer,
                explanation: submission.explanation,
                tags: submission.tags,
            }, {
                new: true,
                runValidators: true,
                session,
            });
            if (!question) {
                throw new AppError_1.default(404, "Question not found");
            }
        }
        /**
         * ----------------------------------------------------
         * Update Submission
         * ----------------------------------------------------
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
         * ----------------------------------------------------
         * Reward Contributor
         * ----------------------------------------------------
         */
        await user_model_1.User.findByIdAndUpdate(submission.submittedBy, {
            $inc: {
                points: questionSubmission_constant_1.CONTRIBUTOR_REWARD,
            },
        }, {
            session,
        });
        await session.commitTransaction();
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
        };
    }
    catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
};
exports.approveSubmission = approveSubmission;
//# sourceMappingURL=approval.service.js.map