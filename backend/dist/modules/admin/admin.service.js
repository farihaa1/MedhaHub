"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const chapter_model_1 = require("../Chapters/chapter.model");
const question_model_1 = require("../Questions/question.model");
const questionSubmission_constant_1 = require("../QuestionSubmission/questionSubmission.constant");
const questionSubmission_model_1 = require("../QuestionSubmission/questionSubmission.model");
const subject_model_1 = require("../Subjects/subject.model");
const topic_model_1 = require("../Topics/topic.model");
const user_model_1 = require("../users/user.model");
const user_constants_1 = require("../users/user.constants");
const questionBank_model_1 = require("../questionBank/questionBank.model");
const practiceSet_model_1 = require("../PracticeSets/practiceSet.model");
const modelTest_model_1 = require("../ModelTests/modelTest.model");
const examSession_model_1 = require("../examSession/examSession.model");
const examSession_constant_1 = require("../examSession/examSession.constant");
const getDashboard = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalUsers, todayRegistrations, premiumUsers, totalSubjects, totalChapters, totalTopics, totalQuestions, questionBanks, practiceSets, modelTests, runningExams, completedExams, pendingSubmissions,] = await Promise.all([
        user_model_1.User.countDocuments(),
        user_model_1.User.countDocuments({
            createdAt: {
                $gte: today,
            },
        }),
        user_model_1.User.countDocuments({
            role: user_constants_1.UserRole.PREMIUM,
        }),
        subject_model_1.Subject.countDocuments(),
        chapter_model_1.Chapter.countDocuments(),
        topic_model_1.Topic.countDocuments(),
        question_model_1.Question.countDocuments(),
        questionBank_model_1.QuestionBank.countDocuments(),
        practiceSet_model_1.PracticeSet.countDocuments(),
        modelTest_model_1.ModelTest.countDocuments(),
        examSession_model_1.ExamSession.countDocuments({
            status: examSession_constant_1.ExamSessionStatus.RUNNING,
        }),
        examSession_model_1.ExamSession.countDocuments({
            status: examSession_constant_1.ExamSessionStatus.SUBMITTED,
        }),
        questionSubmission_model_1.QuestionSubmission.countDocuments({
            status: questionSubmission_constant_1.SubmissionStatus.PENDING,
        }),
    ]);
    return {
        // Users
        totalUsers,
        todayRegistrations,
        premiumUsers,
        // Content
        totalSubjects,
        totalChapters,
        totalTopics,
        totalQuestions,
        questionBanks,
        practiceSets,
        modelTests,
        // Exams
        runningExams,
        completedExams,
        // Review
        pendingSubmissions,
    };
};
exports.AdminService = {
    getDashboard,
};
//# sourceMappingURL=admin.service.js.map