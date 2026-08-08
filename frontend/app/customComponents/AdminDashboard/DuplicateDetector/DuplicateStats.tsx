
"use client";

import {
  Copy,
  FileWarning,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetDuplicateStatsQuery } from "@/app/redux/api/duplicateDetector.api";



export function DuplicateStats() {
  const {
    data,
    isLoading,
  } =
    useGetDuplicateStatsQuery();


  const stats =
    data?.data;


  const items = [
    {
      title: "Total Pairs",

      value: stats?.total ?? 0,

      icon: Copy,
    },

    {
      title: "Pending",

      value: stats?.pending ?? 0,

      icon: Clock3,
    },

    {
      title: "Duplicates",

      value: stats?.duplicate ?? 0,

      icon: FileWarning,
    },

    {
      title: "Not Duplicate",

      value:
        stats?.notDuplicate ?? 0,

      icon: XCircle,
    },

    {
      title: "Exact Matches",

      value: stats?.exact ?? 0,

      icon: CheckCircle2,
    },
  ];


  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            key={item.title}
            className="transition-colors hover:bg-muted/40"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>

              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">
                {isLoading
                  ? "—"
                  : item.value.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
