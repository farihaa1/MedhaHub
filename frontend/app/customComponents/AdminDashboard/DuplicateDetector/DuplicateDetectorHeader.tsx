
"use client";

import {
  ScanSearch,
  RefreshCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  onScan: () => void;

  onRefresh: () => void;

  isRefreshing?: boolean;
}

export function DuplicateDetectorHeader({
  onScan,

  onRefresh,

  isRefreshing,
}: Props) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <ScanSearch className="h-6 w-6" />

          <h1 className="text-2xl font-bold tracking-tight">
            Duplicate Detector
          </h1>
        </div>

        <p className="mt-1 text-sm text-muted-foreground">
          Find, review and resolve duplicate or highly similar questions.
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCcw
            className={`mr-2 h-4 w-4 ${
              isRefreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </Button>

        <Button onClick={onScan}>
          <ScanSearch className="mr-2 h-4 w-4" />

          Start Scan
        </Button>
      </div>
    </div>
  );
}
