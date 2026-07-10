import { Router } from "express";
import ChapterRoutes from "../modules/Chapters/chapter.route";
import SubjectRoutes from "../modules/Subjects/subject.route";
import TopicRoutes from "../modules/Topics/topic.route";
import AuthRoutes from "../modules/auth/auth.route";
import QuestionRoutes from "../modules/Questions/question.route";
import UserRoutes from "../modules/users/user.route";
import ExamEngineRoutes from "../modules/ExamEngine/examEngine.route";
import ExamSessionRoutes from "../modules/examSession/examSession.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/user", UserRoutes);
router.use("/subjects", SubjectRoutes);
router.use("/chapters", ChapterRoutes);
router.use("/topics", TopicRoutes);
router.use("/questions", QuestionRoutes);

router.use("/exam-engine", ExamEngineRoutes);
router.use("/exam-sessions", ExamSessionRoutes);

export default router;
