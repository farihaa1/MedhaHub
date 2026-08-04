import { baseApi } from "./baseApi"
import { IApiResponse } from "@/app/features/auth/auth.type"
import { IEntityValue, IQuestionOption, IQuestionSource, QuestionDifficulty, QuestionStatus, QuestionType } from "./questionsApi"

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
