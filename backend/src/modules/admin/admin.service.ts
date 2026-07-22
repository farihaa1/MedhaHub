import { Chapter } from "../Chapters/chapter.model";
import { Question } from "../Questions/question.model";
import { SubmissionStatus } from "../QuestionSubmission/questionSubmission.constant";
import { QuestionSubmission } from "../QuestionSubmission/questionSubmission.model";
import { Subject } from "../Subjects/subject.model";
import { Topic } from "../Topics/topic.model";
import { User } from "../users/user.model";
import { UserRole } from "../users/user.constants";
import { QuestionBank } from "../questionBank/questionBank.model";
import { PracticeSet } from "../PracticeSets/practiceSet.model";
import { ModelTest } from "../ModelTests/modelTest.model";
import { ExamSession } from "../examSession/examSession.model";
import { ExamSessionStatus } from "../examSession/examSession.constant";

const getDashboard = async () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const [
    totalUsers,
    todayRegistrations,
    premiumUsers,
    totalSubjects,
    totalChapters,
    totalTopics,
    totalQuestions,
    questionBanks,
    practiceSets,
    modelTests,
    runningExams,
    completedExams,
    pendingSubmissions,
  ] = await Promise.all([
    User.countDocuments(),

    User.countDocuments({
      createdAt: {
        $gte: today,
      },
    }),

    User.countDocuments({
      role: UserRole.PREMIUM,
    }),

    Subject.countDocuments(),

    Chapter.countDocuments(),

    Topic.countDocuments(),

    Question.countDocuments(),

    QuestionBank.countDocuments(),

    PracticeSet.countDocuments(),

    ModelTest.countDocuments(),

    ExamSession.countDocuments({
      status: ExamSessionStatus.RUNNING,
    }),

    ExamSession.countDocuments({
      status: ExamSessionStatus.SUBMITTED,
    }),

    QuestionSubmission.countDocuments({
      status: SubmissionStatus.PENDING,
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


export const AdminService = {
  getDashboard,
};
