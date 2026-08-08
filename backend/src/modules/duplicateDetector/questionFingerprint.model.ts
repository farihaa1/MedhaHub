import { Schema, Types, model } from "mongoose";

export interface IQuestionFingerprint {
  questionId: Types.ObjectId;

  hash: string;

  signatures: string[];

  createdAt: Date;

  updatedAt: Date;
}

const questionFingerprintSchema = new Schema<IQuestionFingerprint>(
  {
    questionId: {
      type: Schema.Types.ObjectId,

      ref: "Question",

      required: true,

      unique: true,

      index: true,
    },

    hash: {
      type: String,
      required: true,
    },

    signatures: {
      type: [String],
      default: [],
    },
  },

  {
    timestamps: true,
  },
);

questionFingerprintSchema.index({
  hash: 1,
});

questionFingerprintSchema.index({
  signatures: 1,
});

export const QuestionFingerprint = model<IQuestionFingerprint>(
  "QuestionFingerprint",
  questionFingerprintSchema,
);
