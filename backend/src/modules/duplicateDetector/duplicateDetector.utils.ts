import crypto from "crypto";

import { Types } from "mongoose";

export function normalizeQuestionText(text: string): string {
  if (!text) {
    return "";
  }

  return text
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[।!?.,:;()[\]{}"'`~\-_/\\|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function createQuestionHash(text: string): string {
  const normalized = normalizeQuestionText(text);

  return crypto.createHash("sha256").update(normalized, "utf8").digest("hex");
}

export function createNGrams(text: string, n = 3): Map<string, number> {
  const normalized = normalizeQuestionText(text);

  const grams = new Map<string, number>();

  if (!normalized) {
    return grams;
  }

  if (normalized.length < n) {
    grams.set(normalized, 1);

    return grams;
  }

  for (let i = 0; i <= normalized.length - n; i++) {
    const gram = normalized.slice(i, i + n);

    grams.set(gram, (grams.get(gram) ?? 0) + 1);
  }

  return grams;
}

export function cosineSimilarity(
  a: Map<string, number>,
  b: Map<string, number>,
): number {
  const keys = new Set([...a.keys(), ...b.keys()]);

  let dot = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const key of keys) {
    const valueA = a.get(key) ?? 0;
    const valueB = b.get(key) ?? 0;

    dot += valueA * valueB;

    magnitudeA += valueA * valueA;

    magnitudeB += valueB * valueB;
  }

  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dot / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

export function calculateQuestionSimilarity(
  textA: string,
  textB: string,
): number {
  const normalizedA = normalizeQuestionText(textA);

  const normalizedB = normalizeQuestionText(textB);

  if (!normalizedA || !normalizedB) {
    return 0;
  }

  if (normalizedA === normalizedB) {
    return 1;
  }

  return cosineSimilarity(createNGrams(normalizedA), createNGrams(normalizedB));
}

export function createSignatures(text: string): string[] {
  const normalized = normalizeQuestionText(text);

  const n = 3;

  const signatures = new Set<string>();

  if (!normalized) {
    return [];
  }

  if (normalized.length < n) {
    return [normalized];
  }

  for (let i = 0; i <= normalized.length - n; i++) {
    signatures.add(normalized.slice(i, i + n));
  }

  /*
   * Don't store thousands of signatures
   * for a long question.
   */
  return Array.from(signatures).sort().slice(0, 30);
}

export function sortQuestionIds(idA: Types.ObjectId, idB: Types.ObjectId) {
  const a = idA.toString();
  const b = idB.toString();

  if (a < b) {
    return {
      questionA: idA,
      questionB: idB,
    };
  }

  return {
    questionA: idB,
    questionB: idA,
  };
}
