import { IExtractedPage } from "./extractor";

export interface ParsedOption {
  label: string;
  text: string;
}

export interface ParsedQuestion {
  questionNumber?: number;

  question: string;

  options: ParsedOption[];

  answer?: string;

  pageNumber: number;

  confidence: number;

  needsReview: boolean;
}

const QUESTION_REGEX = /^(\d+|[০-৯]+)[.)।]/;

const OPTION_REGEX = /^([কখগঘ]|[A-D])[.)।:]?\s*(.*)$/i;

const ANSWER_REGEX = /(উত্তর|Answer)\s*[:：]?\s*([কখগঘA-D])/i;

function banglaToEnglishNumber(text: string) {
  return Number(
    text.replace(/[০-৯]/g, (d) => "০১২৩৪৫৬৭৮৯".indexOf(d).toString()),
  );
}

export class Parser {
  static async parse(pages: IExtractedPage[]): Promise<ParsedQuestion[]> {
    const questions: ParsedQuestion[] = [];

    for (const page of pages) {
      const lines = page.text
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

      let currentQuestion: string[] = [];

      for (const line of lines) {
        if (QUESTION_REGEX.test(line) && currentQuestion.length) {
          const q = this.parseQuestion(currentQuestion, page.pageNumber);

          if (q) questions.push(q);

          currentQuestion = [line];
        } else {
          currentQuestion.push(line);
        }
      }

      if (currentQuestion.length) {
        const q = this.parseQuestion(currentQuestion, page.pageNumber);

        if (q) questions.push(q);
      }
    }

    return questions;
  }

  private static parseQuestion(
    lines: string[],
    pageNumber: number,
  ): ParsedQuestion | null {
    const options: ParsedOption[] = [];

    const questionLines: string[] = [];

    let answer: string | undefined;

    let questionNumber: number | undefined;

    let readingOptions = false;

    for (const line of lines) {
      //--------------------------
      // Question Number
      //--------------------------

      if (!questionNumber) {
        const match = line.match(/\d+|[০-৯]+/);

        if (match) {
          questionNumber = banglaToEnglishNumber(match[0]);
        }
      }

      //--------------------------
      // Option
      //--------------------------

      const option = line.match(OPTION_REGEX);

      if (option) {
        readingOptions = true;

        options.push({
          label: option[1],
          text: option[2],
        });

        continue;
      }

      //--------------------------
      // Answer
      //--------------------------

      const ans = line.match(ANSWER_REGEX);

      if (ans) {
        answer = ans[2];

        continue;
      }

      //--------------------------
      // Question Text
      //--------------------------

      if (!readingOptions) {
        questionLines.push(line);
      }
    }

    if (questionLines.length === 0 || options.length < 2) {
      return null;
    }

    //----------------------------------
    // Confidence
    //----------------------------------

    let confidence = 100;

    if (options.length !== 4) confidence -= 20;

    if (!answer) confidence -= 20;

    if (questionLines.join("").length < 10) confidence -= 15;

    return {
      questionNumber,

      question: questionLines.join("\n"),

      options,

      answer,

      pageNumber,

      confidence,

      needsReview: confidence < 90,
    };
  }
}
