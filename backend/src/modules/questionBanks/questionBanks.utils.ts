/* ============================================================
 * Question Banks Utils
 * ========================================================== */

import { DEFAULT_QUESTION_BANKS_SORT } from "./questionBanks.constant";

/* ============================================================
 * Normalize Search
 * ========================================================== */

export const normalizeSearchTerm = (keyword?: string): string =>
  keyword?.trim().toLowerCase() ?? "";

/* ============================================================
 * Normalize Slug
 * ========================================================== */

export const normalizeSlug = (slug: string): string =>
  slug
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

/* ============================================================
 * Generate Display Title
 * ========================================================== */

interface GenerateTitleParams {
  year?: number;
  title: string;
  organization?: string;
  paper?: string;
}

export const generateQuestionBanksTitle = ({
  year,
  title,
  organization,
  paper,
}: GenerateTitleParams): string => {
  const parts: string[] = [];

  if (year) {
    parts.push(String(year));
  }

  parts.push(title);

  if (organization?.trim()) {
    parts.push(`(${organization.trim()})`);
  }

  if (paper?.trim()) {
    parts.push(paper);
  }

  return parts.join(" ");
};

/* ============================================================
 * Pagination
 * ========================================================== */

export const getPagination = (page = 1, limit = 10) => {
  const currentPage = Math.max(1, Number(page));
  const perPage = Math.max(1, Number(limit));

  return {
    page: currentPage,
    limit: perPage,
    skip: (currentPage - 1) * perPage,
  };
};

/* ============================================================
 * Total Pages
 * ========================================================== */

export const calculateTotalPages = (total: number, limit: number): number => {
  if (limit <= 0) return 0;

  return Math.ceil(total / limit);
};

/* ============================================================
 * Default Sort
 * ========================================================== */

export const getDefaultSort = () => ({
  ...DEFAULT_QUESTION_BANKS_SORT,
});

/* ============================================================
 * Is Empty Slug
 * ========================================================== */

export const isEmptySlug = (slug?: string | null): boolean => {
  return !slug || slug.trim().length === 0;
};
