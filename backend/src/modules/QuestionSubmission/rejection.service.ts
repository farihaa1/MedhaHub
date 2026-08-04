import { Types } from "mongoose";

import AppError from "../../error/AppError";

import { QuestionSubmission } from "./questionSubmission.model";
import { SubmissionStatus } from "./questionSubmission.constant";


const rejectSubmission = async (
  submissionId: string,
  adminId: Types.ObjectId,
  reviewComment: string
) => {


  const submission =
    await QuestionSubmission.findById(
      submissionId
    );


  if (!submission) {
    throw new AppError(
      404,
      "Submission not found"
    );
  }



  if (
    submission.status !== SubmissionStatus.PENDING
  ) {
    throw new AppError(
      400,
      "Submission already reviewed"
    );
  }



  submission.status =
    SubmissionStatus.REJECTED;


  submission.reviewedBy =
    adminId;


  submission.reviewedAt =
    new Date();



  submission.reviewComment =
    reviewComment;



  await submission.save();



  return submission;
};



export {
  rejectSubmission,
};