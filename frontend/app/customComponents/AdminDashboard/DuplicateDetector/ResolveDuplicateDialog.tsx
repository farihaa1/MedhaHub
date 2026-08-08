
"use client";

import {
  AlertTriangle,
  Archive,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  Button,
} from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  IDuplicatePair,
} from "@/app/features/duplicateDetector/duplicateDetector.types";


import {
  toast,
} from "sonner";
import { useResolveDuplicateMutation } from "@/app/redux/api/duplicateDetector.api";


interface Props {
  pair: IDuplicatePair | null;

  open: boolean;

  onOpenChange: (
    open: boolean,
  ) => void;
}


export function ResolveDuplicateDialog({
  pair,

  open,

  onOpenChange,
}: Props) {
  const [
    resolveDuplicate,

    {
      isLoading,
    },
  ] =
    useResolveDuplicateMutation();


  if (!pair) {
    return null;
  }


  const resolve = async (
    keepQuestionId: string,

    archiveQuestionId: string,
  ) => {
    try {
      await resolveDuplicate({
        id: pair._id,

        body: {
          keepQuestionId,

          archiveQuestionId,
        },
      }).unwrap();


      toast.success(
        "Duplicate resolved successfully.",
      );

      onOpenChange(false);
    } catch {
      toast.error(
        "Failed to resolve duplicate.",
      );
    }
  };


  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Resolve Duplicate
          </DialogTitle>
        </DialogHeader>


        <Alert>
          <AlertTriangle className="h-4 w-4" />

          <AlertTitle>
            Choose which question to keep
          </AlertTitle>

          <AlertDescription>
            The selected question will remain
            active. The other question will be
            archived.
          </AlertDescription>
        </Alert>


        <div className="grid gap-3">
          <Button
            variant="outline"
            className="h-auto justify-start whitespace-normal p-4 text-left"
            disabled={isLoading}
            onClick={() =>
              resolve(
                pair.questionA._id,

                pair.questionB._id,
              )
            }
          >
            <Archive className="mr-3 h-4 w-4 shrink-0" />

            <div>
              <div className="font-semibold">
                Keep Question A
              </div>

              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {pair.questionA.questionText}
              </div>
            </div>
          </Button>


          <Button
            variant="outline"
            className="h-auto justify-start whitespace-normal p-4 text-left"
            disabled={isLoading}
            onClick={() =>
              resolve(
                pair.questionB._id,

                pair.questionA._id,
              )
            }
          >
            <Archive className="mr-3 h-4 w-4 shrink-0" />

            <div>
              <div className="font-semibold">
                Keep Question B
              </div>

              <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                {pair.questionB.questionText}
              </div>
            </div>
          </Button>
        </div>


        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
