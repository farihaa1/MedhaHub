import fs from "fs/promises";
import path from "path";

export interface PreviewImage {
  page: number;
  imagePath: string;
}

const PREVIEW_ROOT = path.join(process.cwd(), "uploads", "previews");

export const ensurePreviewDirectory = async (pdfId: string) => {
  const folder = path.join(PREVIEW_ROOT, pdfId);

  await fs.mkdir(folder, {
    recursive: true,
  });

  return folder;
};

export const buildPreviewPath = (pdfId: string, page: number) => {
  return path.join(PREVIEW_ROOT, pdfId, `page-${page}.png`);
};

export const buildPreviewUrl = (pdfId: string, page: number): PreviewImage => {
  return {
    page,

    imagePath: `/uploads/previews/${pdfId}/page-${page}.png`,
  };
};
