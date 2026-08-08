
"use client";

import {
  Eye,
  Check,
  X,
  Archive,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/button";

import {
  Badge,
} from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  IDuplicatePair,
  DuplicateStatus,
} from "@/app/features/duplicateDetector/duplicateDetector.types";

import {
  SimilarityBadge,
} from "./SimilarityBadge";

import {
  DUPLICATE_STATUS_LABELS,
} from "@/app/features/duplicateDetector/duplicateDetector.constants";


interface Props {
  pairs: IDuplicatePair[];

  isLoading: boolean;

  onView: (
    pair: IDuplicatePair,
  ) => void;

  onResolve: (
    pair: IDuplicatePair,
  ) => void;

  onReview: (
    pair: IDuplicatePair,

    status: DuplicateStatus,
  ) => void;
}


export function DuplicatePairsTable({
  pairs,

  isLoading,

  onView,

  onResolve,

  onReview,
}: Props) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[45%]">
              Questions
            </TableHead>

            <TableHead>
              Similarity
            </TableHead>

            <TableHead>
              Scope
            </TableHead>

            <TableHead>
              Status
            </TableHead>

            <TableHead className="text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>


        <TableBody>
          {isLoading ? (
            Array.from({
              length: 5,
            }).map((_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={5}>
                  <div className="h-16 animate-pulse rounded-md bg-muted" />
                </TableCell>
              </TableRow>
            ))
          ) : pairs.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-muted-foreground"
              >
                No duplicate pairs found.
              </TableCell>
            </TableRow>
          ) : (
            pairs.map((pair) => (
              <TableRow
                key={pair._id}
                className="group"
              >
                <TableCell>
                  <div className="space-y-3">
                    <div>
                      <Badge
                        variant="outline"
                        className="mb-1"
                      >
                        A
                      </Badge>

                      <p className="line-clamp-2 text-sm">
                        {pair.questionA.questionText}
                      </p>
                    </div>

                    <div>
                      <Badge
                        variant="outline"
                        className="mb-1"
                      >
                        B
                      </Badge>

                      <p className="line-clamp-2 text-sm">
                        {pair.questionB.questionText}
                      </p>
                    </div>
                  </div>
                </TableCell>


                <TableCell>
                  <SimilarityBadge
                    similarity={
                      pair.similarity
                    }
                    exact={
                      pair.exactMatch
                    }
                  />
                </TableCell>


                <TableCell>
                  <Badge variant="secondary">
                    {pair.scope}
                  </Badge>
                </TableCell>


                <TableCell>
                  <Badge
                    variant={
                      pair.status ===
                      DuplicateStatus.DUPLICATE
                        ? "destructive"
                        : pair.status ===
                          DuplicateStatus.NOT_DUPLICATE
                        ? "outline"
                        : "secondary"
                    }
                  >
                    {
                      DUPLICATE_STATUS_LABELS[
                        pair.status
                      ]
                    }
                  </Badge>
                </TableCell>


                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() =>
                        onView(pair)
                      }
                      title="Compare"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>


                    {pair.status ===
                      DuplicateStatus.PENDING && (
                      <>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            onReview(
                              pair,

                              DuplicateStatus.DUPLICATE,
                            )
                          }
                          title="Mark duplicate"
                        >
                          <Check className="h-4 w-4 text-green-600" />
                        </Button>


                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            onReview(
                              pair,

                              DuplicateStatus.NOT_DUPLICATE,
                            )
                          }
                          title="Not duplicate"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}


                    {pair.status ===
                      DuplicateStatus.DUPLICATE && (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          onResolve(pair)
                        }
                        title="Resolve"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
