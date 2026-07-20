import { Schema, model } from "mongoose";
import { IQuestionSubmission } from "./questionSubmission.interface";
import { SubmissionStatus } from "./questionSubmission.constant";

const questionSubmissionSchema = new Schema<IQuestionSubmission>(
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    // Existing Chapter
    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
    },

    // Suggested Chapter
    suggestedChapterTitle: {
      type: String,
      trim: true,
    },

    // Existing Topic
    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
    },

    // Suggested Topic
    suggestedTopicTitle: {
      type: String,
      trim: true,
    },

    // Question
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
        },
      ],

      required: true,

      validate: {
        validator(value: { label: string; text: string }[]) {
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

    // Submission Status
    status: {
      type: String,
      enum: Object.values(SubmissionStatus),
      default: SubmissionStatus.PENDING,
    },

    // Contributor
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
     
    },

    // Admin Review
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

// ================================
// Custom Validation
// ================================
questionSubmissionSchema.pre("validate", function () {
  if (!this.chapterId && !this.suggestedChapterTitle) {
    throw new Error("Either chapterId or suggestedChapterTitle is required");
  }

  if (!this.topicId && !this.suggestedTopicTitle) {
    throw new Error("Either topicId or suggestedTopicTitle is required");
  }
});
// ================================
// Index
// ================================
questionSubmissionSchema.index({
  status: 1,
  createdAt: -1,
});

export const QuestionSubmission = model<IQuestionSubmission>(
  "QuestionSubmission",
  questionSubmissionSchema,
);
