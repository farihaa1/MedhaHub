import { baseApi } from "./baseApi"
import {
  IEntityValue,
  IQuestionOption,
  IQuestionSource,
  QuestionDifficulty,
  QuestionStatus,
  QuestionType,
} from "./questionsApi"

import { IApiResponse } from "@/app/redux/types/auth.type"

/* ============================================================
   Question Submission
============================================================ */

export interface IQuestionSubmission {
  _id: string

  subjectId: IEntityValue

  chapterId: IEntityValue

  topicId: IEntityValue

  type: QuestionType

  questionText: string

  questionImage?: string | null

  options: IQuestionOption[]

  correctAnswer?: string

  explanation?: string

  explanationImage?: string | null

  sources?: IQuestionSource[]

  tags?: string[]

  difficulty?: QuestionDifficulty

  status: QuestionStatus

  createdAt: string

  updatedAt: string
}

/* ============================================================
   Create Question Submission Payload
============================================================ */

export interface ICreateQuestionSubmissionPayload {
  subjectId: string

  chapterId?: string

  topicId?: string

  suggestedChapterTitle?: string

  suggestedTopicTitle?: string

  questionText: string

  options: IQuestionOption[]

  correctAnswer: "A" | "B" | "C" | "D"

  explanation?: string

  tags?: string[]

  type?: QuestionType

  difficulty?: QuestionDifficulty

  sources?: IQuestionSource[]
}

/* ============================================================
   API
============================================================ */

export const questionSubmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuestionSubmission: builder.mutation<
      IApiResponse<IQuestionSubmission>,
      ICreateQuestionSubmissionPayload
    >({
      query: (body) => ({
        url: "/question-submissions",
        method: "POST",
        body,
      }),

      invalidatesTags: ["QuestionSubmission"],
    }),

    getMySubmissions: builder.query<IApiResponse<IQuestionSubmission[]>, void>({
      query: () => ({
        url: "/question-submissions/my",
        method: "GET",
      }),

      providesTags: ["QuestionSubmission"],
    }),
  }),
})

export const { useCreateQuestionSubmissionMutation, useGetMySubmissionsQuery } =
  questionSubmissionApi
