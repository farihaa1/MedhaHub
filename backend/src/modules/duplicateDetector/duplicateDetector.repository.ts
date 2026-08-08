import { Types } from "mongoose";

import { DuplicatePair } from "./duplicateDetector.model";

import { DuplicateScope, DuplicateStatus } from "./duplicateDetector.constants";

import { sortQuestionIds } from "./duplicateDetector.utils";

export async function saveDuplicatePair(
  questionA: Types.ObjectId,

  questionB: Types.ObjectId,

  similarity: number,

  exactMatch: boolean,

  scope: DuplicateScope,

  scopeId?: Types.ObjectId,
) {
  const sorted = sortQuestionIds(questionA, questionB);

  return DuplicatePair.findOneAndUpdate(
    {
      questionA: sorted.questionA,

      questionB: sorted.questionB,

      scope,

      scopeId: scopeId ?? null,
    },

    {
      $set: {
        similarity,

        exactMatch,

        detectedAt: new Date(),
      },

      $setOnInsert: {
        status: DuplicateStatus.PENDING,
      },
    },

    {
      upsert: true,

      new: true,
    },
  );
}

export async function getDuplicatePair(id: string) {
  return DuplicatePair.findById(id)
    .populate("questionA")
    .populate("questionB")
    .lean();
}
