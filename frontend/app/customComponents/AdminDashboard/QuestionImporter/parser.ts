import { ParsedQuestion } from "./parser.types"
import { answerMap } from "./constants"

function normalizeText(text: string) {
  return text
    .replace(/\r/g, "")
    .replace(/\u00A0/g, " ")
    .trim()
}

function splitQuestions(raw: string) {
  const normalized = normalizeText(raw)

  return normalized
    .split(/(?=(?:^|\n)\s*[০-৯\d]+\.)/)
    .map((q) => q.trim())
    .filter(Boolean)
}

function extractQuestionText(block: string) {
  const match = block.match(/^\s*[০-৯\d]+\.\s*([\s\S]*?)\(\s*ক\s*\)/)

  if (!match) return ""

  return match[1].trim()
}

function extractOptions(block: string) {
  const regex =
    /\(\s*(ক|খ|গ|ঘ)\s*\)\s*([\s\S]*?)(?=\(\s*(?:ক|খ|গ|ঘ)\s*\)|উ\.|সমাধান|$)/g

  const options = []

  let match

  while ((match = regex.exec(block)) !== null) {
    options.push({
      letter: match[1],
      text: match[2].trim(),
    })
  }

  return options
}

function extractAnswer(block: string) {
  const match = block.match(/উ\.\s*([কখগঘ])/)

  if (!match) return null

  return match[1] as "ক" | "খ" | "গ" | "ঘ"
}

function extractExplanation(block: string) {
  const match = block.match(/সমাধান[:：]?\s*([\s\S]*)/)

  if (!match) return ""

  return match[1].trim()
}

export function parseQuestions(raw: string): ParsedQuestion[] {
  const blocks = splitQuestions(raw)

  const parsed: ParsedQuestion[] = []

  for (const block of blocks) {
    const questionText = extractQuestionText(block)

    if (!questionText) continue

    const options = extractOptions(block)

    if (options.length !== 4) continue

    const answer = extractAnswer(block)

    if (!answer) continue

    const explanation = extractExplanation(block)

    parsed.push({
      questionText,

      questionImage: null,

      options: options.map((option) => ({
        text: option.text,
        image: null,
        isCorrect:
          answerMap[answer] ===
          answerMap[option.letter as keyof typeof answerMap],
      })),

      explanation,

      explanationImage: null,

      answer,

      tags: [],
    })
  }

  return parsed
}
