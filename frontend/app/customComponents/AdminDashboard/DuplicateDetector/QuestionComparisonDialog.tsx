
"use client";

import {
  ArrowLeftRight,
  CheckCircle2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Separator,
} from "@/components/ui/separator";

import {
  IDuplicatePair,
} from "@/app/features/duplicateDetector/duplicateDetector.types";

import {
  SimilarityBadge,
} from "./SimilarityBadge";


interface Props {
  pair: IDuplicatePair | null;

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
}


export function QuestionComparisonDialog({
  pair,

  open,

  onOpenChange,
}: Props) {
  if (!pair) {
    return null;
  }


  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[90vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            Question Comparison

            <SimilarityBadge
              similarity={
                pair.similarity
              }
              exact={
                pair.exactMatch
              }
            />
          </DialogTitle>
        </DialogHeader>


        <div className="grid gap-6 md:grid-cols-2">

          {/* ================================================= */}
          {/* QUESTION A */}
          {/* ================================================= */}

          <div className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">
                Question A
              </h3>

              <Badge variant="outline">
                {pair.questionA._id}
              </Badge>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7">
              {pair.questionA.questionText}
            </p>


            {pair.questionA.options?.length ? (
              <>
                <Separator className="my-5" />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    Options
                  </h4>

                  {pair.questionA.options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <span className="mr-2 font-medium">
                          {String.fromCharCode(
                            65 + index,
                          )}
                          .
                        </span>

                        {option}
                      </div>
                    ),
                  )}
                </div>
              </>
            ) : null}


            {pair.questionA.answer ? (
              <>
                <Separator className="my-5" />

                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />

                  <span className="font-medium">
                    Answer:
                  </span>

                  <span>
                    {pair.questionA.answer}
                  </span>
                </div>
              </>
            ) : null}
          </div>


          {/* ================================================= */}
          {/* QUESTION B */}
          {/* ================================================= */}

          <div className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold">
                Question B
              </h3>

              <Badge variant="outline">
                {pair.questionB._id}
              </Badge>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-7">
              {pair.questionB.questionText}
            </p>


            {pair.questionB.options?.length ? (
              <>
                <Separator className="my-5" />

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    Options
                  </h4>

                  {pair.questionB.options.map(
                    (option, index) => (
                      <div
                        key={index}
                        className="rounded-lg border p-3 text-sm"
                      >
                        <span className="mr-2 font-medium">
                          {String.fromCharCode(
                            65 + index,
                          )}
                          .
                        </span>

                        {option}
                      </div>
                    ),
                  )}
                </div>
              </>
            ) : null}


            {pair.questionB.answer ? (
              <>
                <Separator className="my-5" />

                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />

                  <span className="font-medium">
                    Answer:
                  </span>

                  <span>
                    {pair.questionB.answer}
                  </span>
                </div>
              </>
            ) : null}
          </div>
        </div>


        <div className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-muted p-3 text-sm">
          <ArrowLeftRight className="h-4 w-4" />

          Similarity:

          <strong>
            {Math.round(
              pair.similarity * 100,
            )}
            %
          </strong>
        </div>
      </DialogContent>
    </Dialog>
  );
}
