import { Schema, model } from "mongoose";
import { IQuestionSubmission } from "./questionSubmission.interface";
import {
  SubmissionStatus,
  SubmissionType,
} from "./questionSubmission.constant";

const questionSubmissionSchema = new Schema<IQuestionSubmission>(
  {
    submissionType: {
      type: String,
      enum: Object.values(SubmissionType),
      required: true,
    },

    existingQuestionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },

    approvedQuestionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },

    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
    },

    suggestedChapterTitle: {
      type: String,
      trim: true,
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },

    suggestedTopicTitle: {
      type: String,
      trim: true,
    },

    questionText: {
      type: String,
      required: true,
      trim: true,
    },

    options: {
      type: [
        {
          _id: false,

          label: {
            type: String,
            enum: ["A", "B", "C", "D"],
            required: true,
          },

          text: {
            type: String,
            required: true,
            trim: true,
          },

          image: {
            type: String,
            default: "",
          },
        },
      ],
      required: true,
      validate: {
        validator(value: any[]) {
          return value.length === 4;
        },
        message: "Question must contain exactly 4 options.",
      },
    },

    correctAnswer: {
      type: String,
      enum: ["A", "B", "C", "D"],
      required: true,
    },

    explanation: {
      type: String,
      default: "",
      trim: true,
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.PENDING,
    },

    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    reviewedAt: {
      type: Date,
    },

    reviewComment: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * ====================================
 * Custom Validation
 * ====================================
 */
questionSubmissionSchema.pre("validate", function () {
  /**
   * UPDATE submission
   */
  if (
    this.submissionType === SubmissionType.UPDATE &&
    !this.existingQuestionId
  ) {
    throw new Error("existingQuestionId is required for UPDATE submission");
  }

  /**
   * NEW submission
   */
  if (this.submissionType === SubmissionType.NEW && this.existingQuestionId) {
    throw new Error("existingQuestionId is only allowed for UPDATE submission");
  }

  /**
   * Chapter validation
   */
  if (!this.chapterId && !this.suggestedChapterTitle) {
    throw new Error("Either chapterId or suggestedChapterTitle is required");
  }

  /**
   * Topic validation
   */
  if (!this.topicId && !this.suggestedTopicTitle) {
    throw new Error("Either topicId or suggestedTopicTitle is required");
  }

  /**
   * Prevent both existing and suggested chapter
   */
  if (this.chapterId && this.suggestedChapterTitle) {
    throw new Error(
      "Provide either chapterId or suggestedChapterTitle, not both.",
    );
  }

  /**
   * Prevent both existing and suggested topic
   */
  if (this.topicId && this.suggestedTopicTitle) {
    throw new Error("Provide either topicId or suggestedTopicTitle, not both.");
  }
});

/**
 * ====================================
 * Indexes
 * ====================================
 */

// Admin dashboard
questionSubmissionSchema.index({
  status: 1,
  createdAt: -1,
});

// User dashboard
questionSubmissionSchema.index({
  submittedBy: 1,
  createdAt: -1,
});

// Search by subject
questionSubmissionSchema.index({
  subjectId: 1,
});

// Search by question
questionSubmissionSchema.index({
  existingQuestionId: 1,
});

// Approved mapping
questionSubmissionSchema.index({
  approvedQuestionId: 1,
});

export const QuestionSubmission = model<IQuestionSubmission>(
  "QuestionSubmission",
  questionSubmissionSchema,
);
