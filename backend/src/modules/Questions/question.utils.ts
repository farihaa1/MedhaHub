export const normalizeQuestion = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, "")
    .trim();
};
