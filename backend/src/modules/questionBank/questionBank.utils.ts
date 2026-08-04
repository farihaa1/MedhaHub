import slugify from "slugify";

/**
 * Generate a clean slug from title
 */
export const generateQuestionBankSlug = (title: string) => {
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
};

/**
 * Build title automatically
 */
export const generateQuestionBankTitle = (
  category: string,
  year?: number,
  paper?: string,
) => {
  let title = "";

  if (year) {
    title += `${year}`;
  }

  title += ` ${category}`;

  if (paper) {
    title += ` ${paper}`;
  }

  return title.trim();
};

/**
 * Normalize search keyword
 */
export const normalizeSearchTerm = (keyword?: string) => {
  if (!keyword) return "";

  return keyword.trim().toLowerCase();
};

/**
 * Calculate total pages
 */
export const calculateTotalPages = (total: number, limit: number) => {
  return Math.ceil(total / limit);
};

/**
 * Mongo pagination helper
 */
export const getPagination = (page = 1, limit = 10) => {
  const currentPage = Number(page);

  const perPage = Number(limit);

  const skip = (currentPage - 1) * perPage;

  return {
    page: currentPage,
    limit: perPage,
    skip,
  };
};

/**
 * Default sorting
 */
export const defaultSort = {
  year: -1,
  createdAt: -1,
};
