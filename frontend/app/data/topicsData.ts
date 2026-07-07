export type TopicStatus = "draft" | "published" | "archived"

export interface Topic {
  id: string
  chapterId: string
  subjectId: string
  title: string
  description?: string
  order: number
  status: TopicStatus
  totalQuestions: number
  questionIds: string[]
  createdAt: string
  updatedAt: string
}

export const topics: Topic[] = [
  // ===========================
  // Chapter 1 : ভাষা
  // ===========================
  {
    id: "tp_01",
    chapterId: "ch_01",
    subjectId: "sub_02",
    title: "ভাষার সংজ্ঞা",
    description: "ভাষার ধারণা, বৈশিষ্ট্য ও প্রয়োজনীয়তা",
    order: 1,
    status: "published",
    totalQuestions: 40,
    questionIds: ["q_0001", "q_0002", "q_0003", "q_0004", "q_0005"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_02",
    chapterId: "ch_01",
    subjectId: "sub_02",
    title: "ভাষার উৎপত্তি",
    description: "ভাষার উৎপত্তি সম্পর্কিত বিভিন্ন মতবাদ",
    order: 2,
    status: "published",
    totalQuestions: 35,
    questionIds: ["q_0006", "q_0007", "q_0008", "q_0009", "q_0010"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_03",
    chapterId: "ch_01",
    subjectId: "sub_02",
    title: "বাংলা ভাষার বিকাশ",
    description: "প্রাচীন থেকে আধুনিক বাংলা ভাষার বিবর্তন",
    order: 3,
    status: "published",
    totalQuestions: 55,
    questionIds: ["q_0011", "q_0012", "q_0013", "q_0014", "q_0015"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_04",
    chapterId: "ch_01",
    subjectId: "sub_02",
    title: "প্রমিত ভাষা",
    description: "প্রমিত ভাষার ব্যবহার ও বৈশিষ্ট্য",
    order: 4,
    status: "published",
    totalQuestions: 42,
    questionIds: ["q_0016", "q_0017", "q_0018", "q_0019", "q_0020"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_05",
    chapterId: "ch_01",
    subjectId: "sub_02",
    title: "আঞ্চলিক ভাষা",
    description: "বাংলাদেশ ও পশ্চিমবঙ্গের আঞ্চলিক ভাষা",
    order: 5,
    status: "published",
    totalQuestions: 38,
    questionIds: ["q_0021", "q_0022", "q_0023", "q_0024", "q_0025"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },

  // ===========================
  // Chapter 2 : ধ্বনি
  // ===========================
  {
    id: "tp_06",
    chapterId: "ch_02",
    subjectId: "sub_02",
    title: "ধ্বনি পরিচিতি",
    description: "ধ্বনি কী ও এর শ্রেণিবিভাগ",
    order: 1,
    status: "published",
    totalQuestions: 45,
    questionIds: ["q_0026", "q_0027", "q_0028", "q_0029", "q_0030"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_07",
    chapterId: "ch_02",
    subjectId: "sub_02",
    title: "স্বরধ্বনি",
    description: "বাংলা স্বরধ্বনির পরিচয়",
    order: 2,
    status: "published",
    totalQuestions: 36,
    questionIds: ["q_0031", "q_0032", "q_0033", "q_0034", "q_0035"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_08",
    chapterId: "ch_02",
    subjectId: "sub_02",
    title: "ব্যঞ্জনধ্বনি",
    description: "বাংলা ব্যঞ্জনধ্বনির শ্রেণিবিভাগ",
    order: 3,
    status: "published",
    totalQuestions: 48,
    questionIds: ["q_0036", "q_0037", "q_0038", "q_0039", "q_0040"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_09",
    chapterId: "ch_02",
    subjectId: "sub_02",
    title: "উচ্চারণ",
    description: "বাংলা উচ্চারণের নিয়ম",
    order: 4,
    status: "published",
    totalQuestions: 36,
    questionIds: ["q_0041", "q_0042", "q_0043", "q_0044", "q_0045"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },

  // ===========================
  // Chapter 3 : শব্দ
  // ===========================
  {
    id: "tp_10",
    chapterId: "ch_03",
    subjectId: "sub_02",
    title: "শব্দের গঠন",
    description: "শব্দ গঠনের নিয়ম",
    order: 1,
    status: "published",
    totalQuestions: 55,
    questionIds: ["q_0046", "q_0047", "q_0048", "q_0049", "q_0050"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_11",
    chapterId: "ch_03",
    subjectId: "sub_02",
    title: "তৎসম শব্দ",
    description: "তৎসম শব্দের ব্যবহার",
    order: 2,
    status: "published",
    totalQuestions: 42,
    questionIds: ["q_0051", "q_0052", "q_0053", "q_0054", "q_0055"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_12",
    chapterId: "ch_03",
    subjectId: "sub_02",
    title: "তদ্ভব শব্দ",
    description: "তদ্ভব শব্দের বৈশিষ্ট্য",
    order: 3,
    status: "published",
    totalQuestions: 46,
    questionIds: ["q_0056", "q_0057", "q_0058", "q_0059", "q_0060"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_13",
    chapterId: "ch_03",
    subjectId: "sub_02",
    title: "দেশি ও বিদেশি শব্দ",
    description: "বাংলায় বিদেশি শব্দের ব্যবহার",
    order: 4,
    status: "published",
    totalQuestions: 50,
    questionIds: ["q_0061", "q_0062", "q_0063", "q_0064", "q_0065"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_14",
    chapterId: "ch_03",
    subjectId: "sub_02",
    title: "শব্দের অর্থ",
    description: "অর্থের ভিত্তিতে শব্দের শ্রেণিবিভাগ",
    order: 5,
    status: "published",
    totalQuestions: 47,
    questionIds: ["q_0066", "q_0067", "q_0068", "q_0069", "q_0070"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
  {
    id: "tp_15",
    chapterId: "ch_03",
    subjectId: "sub_02",
    title: "সমার্থক শব্দ",
    description: "সমার্থক ও প্রতিশব্দ",
    order: 6,
    status: "published",
    totalQuestions: 40,
    questionIds: ["q_0071", "q_0072", "q_0073", "q_0074", "q_0075"],
    createdAt: "2026-07-01",
    updatedAt: "2026-07-01",
  },
]