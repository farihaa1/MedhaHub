import { Router } from "express";
import ChapterRoutes from "../modules/Chapters/chapter.route";
import SubjectRoutes from "../modules/Subjects/subject.route";
import TopicRoutes from "../modules/Topics/topic.route";
import AuthRoutes from "../modules/auth/auth.route";
import QuestionRoutes from "../modules/Questions/question.route";
import UserRoutes from "../modules/users/user.route";
import ExamEngineRoutes from "../modules/ExamEngine/examEngine.route";
import ExamSessionRoutes from "../modules/examSession/examSession.route";
import ResultRoutes from "../modules/Result/result.route";
import QuestionSubmissionRoutes from "../modules/QuestionSubmission/questionSubmission.route";
import AdminDashboardRoutes from "../modules/admin/admin.route";
import QuestionBankItemRoutes from "../modules/questionBankItems/questionBankItem.route";
import QuestionBankRoutes from "../modules/questionBank/questionBank.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/subjects", SubjectRoutes);
router.use("/chapters", ChapterRoutes);
router.use("/topics", TopicRoutes);
router.use("/questions", QuestionRoutes);
router.use("/exam-engine", ExamEngineRoutes);
router.use("/exam", ExamSessionRoutes);
router.use("/result", ResultRoutes);
router.use("/question-submissions", QuestionSubmissionRoutes);
router.use("/admin",AdminDashboardRoutes)
router.use("/question-bank", QuestionBankRoutes);
router.use("/question-bank-items", QuestionBankItemRoutes);
export default router;
