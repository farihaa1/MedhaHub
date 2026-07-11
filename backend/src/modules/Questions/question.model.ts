import { Schema, model } from "mongoose";

import { IQuestion } from "./question.interface";
import { QuestionStatus } from "./question.constant";

const questionSchema = new Schema<IQuestion>(
  
  {
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    chapterId: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },

    topicId: {
      type: Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
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
        },
      ],

      required: true,
      validate: {
        validator: (value: { label: string; text: string }[]) => {
          return value.length === 4;
        },
        message: "MCQ must have exactly 4 options",
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

    examInfo: {
      category: {
        type: String,
        enum: ["BCS", "Bank", "Primary", "NTRCA", "Other"],
      },

      examName: {
        type: String,
        trim: true,
      },

      year: {
        type: Number,
      },
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: Object.values(QuestionStatus),
      default: QuestionStatus.DRAFT,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  {
    timestamps: true,
  },
);

export const Question = model<IQuestion>("Question", questionSchema);
