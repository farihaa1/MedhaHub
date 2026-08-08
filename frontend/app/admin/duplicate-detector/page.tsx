"use client"

import { useState } from "react"

import {
  DuplicateScope,
  DuplicateStatus,
  IDuplicatePair,
} from "@/app/features/duplicateDetector/duplicateDetector.types"

import { toast } from "sonner"
import {
  useGetDuplicatePairsQuery,
  useReviewDuplicateMutation,
} from "@/app/redux/api/duplicateDetector.api"
import { DuplicateDetectorHeader } from "@/app/customComponents/AdminDashboard/DuplicateDetector/DuplicateDetectorHeader"
import { DuplicateFilters } from "@/app/customComponents/AdminDashboard/DuplicateDetector/DuplicateFilters"
import { DuplicateStats } from "@/app/customComponents/AdminDashboard/DuplicateDetector/DuplicateStats"
import { DuplicatePairsTable } from "@/app/customComponents/AdminDashboard/DuplicateDetector/DuplicatePairsTable"
import { QuestionComparisonDialog } from "@/app/customComponents/AdminDashboard/DuplicateDetector/QuestionComparisonDialog"
import { ResolveDuplicateDialog } from "@/app/customComponents/AdminDashboard/DuplicateDetector/ResolveDuplicateDialog"

export default function DuplicateDetectorPage() {
  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [status, setStatus] = useState<DuplicateStatus | undefined>()

  const [scope, setScope] = useState<DuplicateScope | undefined>()

  const [minSimilarity, setMinSimilarity] = useState<number | undefined>()

  const [search, setSearch] = useState("")

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const [page, setPage] = useState(1)

  // ==========================================================
  // SELECTED PAIR
  // ==========================================================

  const [selectedPair, setSelectedPair] = useState<IDuplicatePair | null>(null)

  const [comparisonOpen, setComparisonOpen] = useState(false)

  const [resolveOpen, setResolveOpen] = useState(false)

  // ==========================================================
  // API
  // ==========================================================

  const {
    data,

    isLoading,

    isFetching,

    refetch,
  } = useGetDuplicatePairsQuery({
    status,

    scope,

    minSimilarity,

    page,

    limit: 20,
  })

  const [reviewDuplicate] = useReviewDuplicateMutation()

  const pairs = data?.data ?? []

  const meta = data?.meta

  // ==========================================================
  // REVIEW
  // ==========================================================

  const handleReview = async (
    pair: IDuplicatePair,

    nextStatus: DuplicateStatus
  ) => {
    try {
      await reviewDuplicate({
        id: pair._id,

        body: {
          status: nextStatus,
        },
      }).unwrap()

      toast.success(
        nextStatus === DuplicateStatus.DUPLICATE
          ? "Marked as duplicate."
          : "Marked as not duplicate."
      )
    } catch {
      toast.error("Failed to update duplicate status.")
    }
  }

  // ==========================================================
  // VIEW
  // ==========================================================

  const handleView = (pair: IDuplicatePair) => {
    setSelectedPair(pair)

    setComparisonOpen(true)
  }

  // ==========================================================
  // RESOLVE
  // ==========================================================

  const handleResolve = (pair: IDuplicatePair) => {
    setSelectedPair(pair)

    setResolveOpen(true)
  }

  // ==========================================================
  // RESET
  // ==========================================================

  const resetFilters = () => {
    setStatus(undefined)

    setScope(undefined)

    setMinSimilarity(undefined)

    setSearch("")

    setPage(1)
  }

  // ==========================================================
  // CLIENT SEARCH
  // ==========================================================

  const filteredPairs = search.trim()
    ? pairs.filter((pair) => {
        const query = search.toLowerCase().trim()

        return (
          pair.questionA.questionText.toLowerCase().includes(query) ||
          pair.questionB.questionText.toLowerCase().includes(query)
        )
      })
    : pairs

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* ==================================================== */}
      {/* HEADER */}
      {/* ==================================================== */}

      <DuplicateDetectorHeader
        onScan={() => {
          toast.info("Scan dialog will be opened here.")
        }}

        onRefresh={() => refetch()}

        isRefreshing={isFetching}
      />

      {/* ==================================================== */}
      {/* STATS */}
      {/* ==================================================== */}

      <DuplicateStats />

      {/* ==================================================== */}
      {/* FILTERS */}
      {/* ==================================================== */}

      <DuplicateFilters
        status={status}

        scope={scope}

        minSimilarity={minSimilarity}

        search={search}

        onStatusChange={(value) => {
          setStatus(value)

          setPage(1)
        }}

        onScopeChange={(value) => {
          setScope(value)

          setPage(1)
        }}

        onSimilarityChange={(value) => {
          setMinSimilarity(value)

          setPage(1)
        }}

        onSearchChange={setSearch}

        onReset={resetFilters}
      />

      {/* ==================================================== */}
      {/* TABLE */}
      {/* ==================================================== */}

      <DuplicatePairsTable
        pairs={filteredPairs}

        isLoading={isLoading}

        onView={handleView}

        onResolve={handleResolve}

        onReview={handleReview}
      />

      {/* ==================================================== */}
      {/* PAGINATION */}
      {/* ==================================================== */}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </p>

          <div className="flex gap-2">
            <button
              className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((value) => value - 1)}
            >
              Previous
            </button>

            <button
              className="rounded-md border px-3 py-2 text-sm disabled:opacity-50"
              disabled={page >= meta.totalPages || isFetching}
              onClick={() => setPage((value) => value + 1)}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* COMPARISON */}
      {/* ==================================================== */}

      <QuestionComparisonDialog
        pair={selectedPair}

        open={comparisonOpen}

        onOpenChange={setComparisonOpen}
      />

      {/* ==================================================== */}
      {/* RESOLVE */}
      {/* ==================================================== */}

      <ResolveDuplicateDialog
        pair={selectedPair}

        open={resolveOpen}

        onOpenChange={setResolveOpen}
      />
    </div>
  )
}
