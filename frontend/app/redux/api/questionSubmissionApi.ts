import { baseApi } from "./baseApi"
import { IApiResponse } from "@/app/features/auth/auth.type"

export interface IQuestionSubmission {
  _id?: string
  subjectId: string
  chapterId?: string
  suggestedChapterTitle?: string
  topicId?: string
  suggestedTopicTitle?: string
  questionText: string
  options: {
    label: "A" | "B" | "C" | "D"
    text: string
  }[]
  correctAnswer: "A" | "B" | "C" | "D"
  explanation?: string
  tags?: string[]
}

export const questionSubmissionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createQuestionSubmission: builder.mutation<
      IApiResponse<IQuestionSubmission>,
      Partial<IQuestionSubmission>
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

export const {
  useCreateQuestionSubmissionMutation,
  useGetMySubmissionsQuery,
} = questionSubmissionApi
