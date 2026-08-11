"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const examSession_model_1 = require("../examSession/examSession.model");
const examSession_constant_1 = require("../examSession/examSession.constant");
const result_model_1 = require("./result.model");
const question_model_1 = require("../Questions/question.model");
// ============================================================
// OPTION LABELS
// ============================================================
const OPTION_LABELS = ["A", "B", "C", "D"];
// ============================================================
// CREATE RESULT
// ============================================================
const createResult = async (sessionId) => {
    // ----------------------------------------------------------
    // Find session
    // ----------------------------------------------------------
    const session = await examSession_model_1.ExamSession.findById(sessionId);
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    // ----------------------------------------------------------
    // Check session status
    // ----------------------------------------------------------
    if (session.status !== examSession_constant_1.ExamSessionStatus.SUBMITTED &&
        session.status !== examSession_constant_1.ExamSessionStatus.EXPIRED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam has not been submitted.");
    }
    // ----------------------------------------------------------
    // Calculate statistics
    // ----------------------------------------------------------
    const totalQuestions = session.questions.length;
    const attempted = session.answers.length;
    const correct = session.answers.filter((answer) => answer.isCorrect === true).length;
    const wrong = session.answers.filter((answer) => answer.isCorrect === false).length;
    const skipped = Math.max(0, totalQuestions - attempted);
    // ----------------------------------------------------------
    // Calculate score
    // ----------------------------------------------------------
    const score = correct - wrong * session.negativeMark;
    // ----------------------------------------------------------
    // Calculate accuracy
    // ----------------------------------------------------------
    const accuracy = attempted === 0 ? 0 : Number(((correct / attempted) * 100).toFixed(2));
    // ----------------------------------------------------------
    // Create / Update Result
    // ----------------------------------------------------------
    const result = await result_model_1.Result.findOneAndUpdate({
        sessionId: session._id,
    }, {
        sessionId: session._id,
        userId: session.userId,
        totalQuestions,
        attempted,
        correct,
        wrong,
        skipped,
        score,
        accuracy,
        negativeMark: session.negativeMark,
    }, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
    });
    // ----------------------------------------------------------
    // Persist result inside session
    // ----------------------------------------------------------
    session.result = {
        score,
        correct,
        wrong,
        skipped,
        accuracy,
    };
    await session.save();
    return result;
};
// ============================================================
// RESULT REVIEW
// ============================================================
const getResultReview = async (sessionId, userId) => {
    // ----------------------------------------------------------
    // Get session
    // ----------------------------------------------------------
    const session = await examSession_model_1.ExamSession.findOne({
        _id: sessionId,
        userId,
    });
    if (!session) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Exam session not found.");
    }
    // ----------------------------------------------------------
    // Check exam status
    // ----------------------------------------------------------
    if (session.status !== examSession_constant_1.ExamSessionStatus.SUBMITTED &&
        session.status !== examSession_constant_1.ExamSessionStatus.EXPIRED) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, "Exam has not been submitted yet.");
    }
    // ----------------------------------------------------------
    // Get result
    // ----------------------------------------------------------
    let result = await result_model_1.Result.findOne({
        sessionId,
        userId,
    });
    // ----------------------------------------------------------
    // Safety fallback
    //
    // If result was not created during submit,
    // create it now.
    // ----------------------------------------------------------
    if (!result) {
        result = await createResult(sessionId);
    }
    // ----------------------------------------------------------
    // Get question IDs
    // ----------------------------------------------------------
    const questionIds = session.questions.map((question) => question.questionId);
    // ----------------------------------------------------------
    // Get questions
    // ----------------------------------------------------------
    const questions = await question_model_1.Question.find({
        _id: {
            $in: questionIds,
        },
    })
        .select("questionText questionImage options explanation explanationImage")
        .lean();
    // ----------------------------------------------------------
    // Answer map
    // ----------------------------------------------------------
    const answerMap = new Map(session.answers.map((answer) => [answer.questionId.toString(), answer]));
    // ----------------------------------------------------------
    // Question map
    // ----------------------------------------------------------
    const questionMap = new Map(questions.map((question) => [question._id.toString(), question]));
    // ----------------------------------------------------------
    // Build review questions
    // ----------------------------------------------------------
    const reviewQuestions = session.questions
        .map((sessionQuestion) => {
        const question = questionMap.get(sessionQuestion.questionId.toString());
        if (!question) {
            return null;
        }
        const answer = answerMap.get(sessionQuestion.questionId.toString());
        // --------------------------------------------------
        // Correct option
        // --------------------------------------------------
        const correctIndex = question.options.findIndex((option) => option.isCorrect === true);
        const correctOption = correctIndex >= 0 ? OPTION_LABELS[correctIndex] : undefined;
        // --------------------------------------------------
        // Review question
        // --------------------------------------------------
        return {
            id: question._id.toString(),
            order: sessionQuestion.order,
            questionText: question.questionText,
            questionImage: question.questionImage ?? undefined,
            options: question.options.map((option, index) => ({
                label: OPTION_LABELS[index],
                text: option.text,
                image: option.image ?? undefined,
                isCorrect: option.isCorrect,
            })),
            selectedOption: answer?.selectedOption,
            correctOption,
            isCorrect: answer?.isCorrect ?? false,
            explanation: question.explanation,
            explanationImage: question.explanationImage ?? undefined,
        };
    })
        .filter((question) => question !== null);
    // ----------------------------------------------------------
    // Return
    // ----------------------------------------------------------
    return {
        result: {
            totalQuestions: result.totalQuestions,
            attempted: result.attempted,
            correct: result.correct,
            wrong: result.wrong,
            skipped: result.skipped,
            score: result.score,
            accuracy: result.accuracy,
            negativeMark: result.negativeMark,
            status: session.status,
        },
        questions: reviewQuestions,
    };
};
// ============================================================
// EXPORT
// ============================================================
exports.ResultService = {
    createResult,
    getResultReview,
};
//# sourceMappingURL=result.service.js.map