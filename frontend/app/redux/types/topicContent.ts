// app/redux/types/topicContent.ts

export type TopicContentStatus = "draft" | "published"

export interface TopicContentTopic {
  _id: string
  title: string
  slug: string
  totalQuestions: number

  chapterId?: {
    _id: string
    title: string
    slug: string
  }

  subjectId?: {
    _id: string
    title: string
    slug: string
  }
}

export interface ITopicContent {
  _id: string

  topicId: TopicContentTopic | string

  bullets: string[]

  status: TopicContentStatus

  createdAt: string
  updatedAt: string
}

export interface TopicContentApiResponse {
  success: boolean
  message: string
  data: ITopicContent | null
}

export interface CreateTopicContentPayload {
  topicId: string
  bullets: string[]
  status?: TopicContentStatus
}

export interface UpdateTopicContentPayload {
  bullets?: string[]
  status?: TopicContentStatus
}
