import { HydratedDocument } from "mongoose";
import { IExamSession } from "../examSession.interface";
import { ExamSessionStatus } from "../examSession.constant";
import { calculateRemainingTime } from "../examSession.utils";
import { IExamSessionDTO } from "../dto/examSession.dto";

export const mapExamSession = (
  session: HydratedDocument<IExamSession>,
): IExamSessionDTO => {
  return {
    id: session.id,

    status: session.status,

    duration: session.duration,

    remainingTime: calculateRemainingTime(session.startTime, session.duration),

    questions: session.questions.map((q: any) => ({
      order: q.order,

      question: {
        id: q.questionId._id.toString(),

        questionText: q.questionId.questionText,

        options: q.questionId.options.map((option: any, index: number) => ({
          _id: option._id.toString(),
          label: ["A", "B", "C", "D"][index] as "A" | "B" | "C" | "D",
          text: option.text,
          image: option.image ?? null,
          isCorrect:
            session.status === ExamSessionStatus.SUBMITTED
              ? option.isCorrect
              : false,
        })),

        explanation:
          session.status === ExamSessionStatus.SUBMITTED
            ? q.questionId.explanation
            : undefined,
      },
    })),
  };
};
