
"use client";

import {
  SlidersHorizontal,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Button,
} from "@/components/ui/button";

import {
  Input,
} from "@/components/ui/input";

import {
  DuplicateScope,
  DuplicateStatus,
} from "@/app/features/duplicateDetector/duplicateDetector.types";

import {
  DUPLICATE_SCOPE_LABELS,
  DUPLICATE_STATUS_LABELS,
} from "@/app/features/duplicateDetector/duplicateDetector.constants";


interface Props {
  status?: DuplicateStatus;

  scope?: DuplicateScope;

  minSimilarity?: number;

  search?: string;

  onStatusChange: (
    value?: DuplicateStatus,
  ) => void;

  onScopeChange: (
    value?: DuplicateScope,
  ) => void;

  onSimilarityChange: (
    value?: number,
  ) => void;

  onSearchChange: (
    value: string,
  ) => void;

  onReset: () => void;
}


export function DuplicateFilters({
  status,

  scope,

  minSimilarity,

  search,

  onStatusChange,

  onScopeChange,

  onSimilarityChange,

  onSearchChange,

  onReset,
}: Props) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />

            <span className="text-sm font-medium">
              Filters
            </span>
          </div>

          <Input
            placeholder="Search questions..."
            value={search ?? ""}
            onChange={(e) =>
              onSearchChange(
                e.target.value,
              )
            }
            className="lg:max-w-xs"
          />

          <Select
            value={status ?? "all"}
            onValueChange={(value) =>
              onStatusChange(
                value === "all"
                  ? undefined
                  : (value as DuplicateStatus),
              )
            }
          >
            <SelectTrigger className="lg:w-[170px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All statuses
              </SelectItem>

              {Object.entries(
                DUPLICATE_STATUS_LABELS,
              ).map(
                ([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                  >
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Select
            value={scope ?? "all"}
            onValueChange={(value) =>
              onScopeChange(
                value === "all"
                  ? undefined
                  : (value as DuplicateScope),
              )
            }
          >
            <SelectTrigger className="lg:w-[170px]">
              <SelectValue placeholder="Scope" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                All scopes
              </SelectItem>

              {Object.entries(
                DUPLICATE_SCOPE_LABELS,
              ).map(
                ([value, label]) => (
                  <SelectItem
                    key={value}
                    value={value}
                  >
                    {label}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>

          <Select
            value={
              minSimilarity
                ? String(
                    minSimilarity,
                  )
                : "all"
            }
            onValueChange={(value) =>
              onSimilarityChange(
                value === "all"
                  ? undefined
                  : Number(value),
              )
            }
          >
            <SelectTrigger className="lg:w-[160px]">
              <SelectValue placeholder="Similarity" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">
                Any similarity
              </SelectItem>

              <SelectItem value="0.7">
                70%+
              </SelectItem>

              <SelectItem value="0.8">
                80%+
              </SelectItem>

              <SelectItem value="0.85">
                85%+
              </SelectItem>

              <SelectItem value="0.9">
                90%+
              </SelectItem>

              <SelectItem value="0.95">
                95%+
              </SelectItem>

              <SelectItem value="1">
                Exact
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            onClick={onReset}
            className="lg:ml-auto"
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
