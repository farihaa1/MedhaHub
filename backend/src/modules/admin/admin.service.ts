import { Chapter } from "../Chapters/chapter.model";
import { Question } from "../Questions/question.model";
import { SubmissionStatus } from "../QuestionSubmission/questionSubmission.constant";
import { QuestionSubmission } from "../QuestionSubmission/questionSubmission.model";
import { Subject } from "../Subjects/subject.model";
import { Topic } from "../Topics/topic.model";
import { User } from "../users/user.model";

const getDashboard = async () => {
  const [
    totalUsers,
    totalSubjects,
    totalChapters,
    totalTopics,
    totalQuestions,
    pendingSubmissions,
  ] = await Promise.all([
    User.countDocuments(),
    Subject.countDocuments(),
    Chapter.countDocuments(),
    Topic.countDocuments(),
    Question.countDocuments(),
    QuestionSubmission.countDocuments({
      status: SubmissionStatus.PENDING,
    }),
  ]);

  return {
    totalUsers,
    totalSubjects,
    totalChapters,
    totalTopics,
    totalQuestions,
    pendingSubmissions,
  };
};

export const AdminService = {
  getDashboard,
};
