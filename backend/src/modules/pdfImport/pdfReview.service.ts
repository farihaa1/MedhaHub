import mongoose from "mongoose";
import { PdfImport } from "./pdfImport.model";
import { Question } from "../Questions/question.model";
import { QuestionStatus } from "../Questions/question.constant";
import { QuestionBankItem } from "../questionBankItems/questionBankItem.model";
import { QuestionBanks } from "../questionBanks/questionBanks.model";

class PdfReviewService {
  async approveQuestion(
    pdfImportId: string,
    reviewId: string,
    adminId: string,
  ) {
    const pdfImport = await PdfImport.findById(pdfImportId);

    if (!pdfImport) {
      throw new Error("PDF import not found");
    }

    const review = pdfImport.reviewQuestions.id(reviewId);

    if (!review) {
      throw new Error("Review question not found");
    }

    const session = await mongoose.startSession();

    session.startTransaction();

    try {
      const [question] = await Question.create(
        [
          {
            subjectId: pdfImport.metadata.subject,

            chapterId: pdfImport.metadata.chapter,

            topicId: pdfImport.metadata.topic,

            questionText: review.questionText,

            questionImage: review.questionImage,

            options: review.options,

            explanation: review.explanation,

            difficulty: review.difficulty,

            tags: review.tags,

            status: QuestionStatus.APPROVED,

            createdBy: pdfImport.uploadedBy,

            approvedBy: adminId,

            approvedAt: new Date(),
          },
        ],
        {
          session,
        },
      );

      if (pdfImport.metadata.questionBank) {
        const order = await QuestionBankItem.countDocuments({
          questionBank: pdfImport.metadata.questionBank,
        });

        await QuestionBankItem.create(
          [
            {
              questionBank: pdfImport.metadata.questionBank,

              question: question._id,

              order: order + 1,

              createdBy: adminId,
            },
          ],
          {
            session,
          },
        );

        await QuestionBanks.findByIdAndUpdate(
          pdfImport.metadata.questionBank,

          {
            $inc: {
              totalQuestions: 1,
            },
          },

          {
            session,
          },
        );
      }

      review.status = "APPROVED";

      review.reviewedBy = adminId as any;

      review.reviewedAt = new Date();

      await pdfImport.save({
        session,
      });

      await session.commitTransaction();

      return question;
    } catch (error) {
      await session.abortTransaction();

      throw error;
    } finally {
      session.endSession();
    }
  }

  async rejectQuestion(
    pdfImportId: string,
    reviewId: string,
    reason: string,
    adminId: string,
  ) {
    const pdfImport = await PdfImport.findById(pdfImportId);

    if (!pdfImport) {
      throw new Error("PDF import not found");
    }

    const review = pdfImport.reviewQuestions.id(reviewId);

    if (!review) {
      throw new Error("Review question not found");
    }

    review.status = "REJECTED";

    review.reviewRemark = reason;

    review.reviewedBy = adminId as any;

    review.reviewedAt = new Date();

    await pdfImport.save();

    return review;
  }
}

export const pdfReviewService = new PdfReviewService();
