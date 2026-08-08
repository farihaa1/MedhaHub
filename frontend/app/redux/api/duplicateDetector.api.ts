
import {
  IDuplicatePairsQuery,
  IDuplicatePairsResponse,
  IDuplicateScanRequest,
  IDuplicateJobResponse,
  IDuplicateStats,
  DuplicateStatus,
  IReviewDuplicateRequest,
  IResolveDuplicateRequest,
} from "@/app/features/duplicateDetector/duplicateDetector.types"
import { baseApi } from "./baseApi";


export const duplicateDetectorApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({

      // ======================================================
      // GET STATS
      // ======================================================

      getDuplicateStats:
        builder.query<
          {
            success: boolean;

            message: string;

            data: IDuplicateStats;
          },
          void
        >({
          query: () => ({
            url: "/duplicate-detector/stats",

            method: "GET",
          }),

          providesTags: [
            "DuplicateDetector",
          ],
        }),


      // ======================================================
      // GET PAIRS
      // ======================================================

      getDuplicatePairs:
        builder.query<
          IDuplicatePairsResponse,
          IDuplicatePairsQuery
        >({
          query: (params) => ({
            url: "/duplicate-detector/pairs",

            method: "GET",

            params,
          }),

          providesTags: [
            "DuplicateDetector",
          ],
        }),


      // ======================================================
      // SCAN
      // ======================================================

      scanDuplicates:
        builder.mutation<
          IDuplicateJobResponse,
          IDuplicateScanRequest
        >({
          query: (body) => ({
            url: "/duplicate-detector/scan",

            method: "POST",

            body,
          }),
        }),


      // ======================================================
      // CHECK ONE QUESTION
      // ======================================================

      checkQuestionDuplicates:
        builder.mutation<
          IDuplicateJobResponse,
          string
        >({
          query: (questionId) => ({
            url:
              `/duplicate-detector/question/${questionId}`,

            method: "POST",
          }),
        }),


      // ======================================================
      // REVIEW
      // ======================================================

      reviewDuplicate:
        builder.mutation<
          unknown,
          {
            id: string;

            body: IReviewDuplicateRequest;
          }
        >({
          query: ({ id, body }) => ({
            url:
              `/duplicate-detector/${id}/review`,

            method: "PATCH",

            body,
          }),

          invalidatesTags: [
            "DuplicateDetector",
          ],
        }),


      // ======================================================
      // RESOLVE
      // ======================================================

      resolveDuplicate:
        builder.mutation<
          unknown,
          {
            id: string;

            body: IResolveDuplicateRequest;
          }
        >({
          query: ({ id, body }) => ({
            url:
              `/duplicate-detector/${id}/resolve`,

            method: "PATCH",

            body,
          }),

          invalidatesTags: [
            "DuplicateDetector",
          ],
        }),
    }),
  });


export const {
  useGetDuplicateStatsQuery,

  useGetDuplicatePairsQuery,

  useScanDuplicatesMutation,

  useCheckQuestionDuplicatesMutation,

  useReviewDuplicateMutation,

  useResolveDuplicateMutation,
} = duplicateDetectorApi;
