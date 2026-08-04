import fs from "fs/promises";
import path from "path";

import { fromPath } from "pdf2pic";
import { PDFDocument } from "pdf-lib";

import {
  PreviewImage,
  buildPreviewUrl,
  ensurePreviewDirectory,
} from "./previewGenerator";

export interface ConvertedPdf {
  totalPages: number;

  previews: PreviewImage[];
}

export const convertPdfToImages = async (
  pdfPath: string,

  pdfId: string,
): Promise<ConvertedPdf> => {
  console.log("PDF PATH:", pdfPath);

  // Read PDF

  const pdfBuffer = await fs.readFile(pdfPath);

  const pdf = await PDFDocument.load(pdfBuffer);

  const totalPages = pdf.getPageCount();

  console.log("TOTAL PAGES:", totalPages);

  // Create output folder

  const outputDir = await ensurePreviewDirectory(pdfId);

  console.log("OUTPUT DIR:", outputDir);

  const converter = fromPath(pdfPath, {
    density: 200,

    saveFilename: "page",

    savePath: outputDir,

    format: "png",

    width: 1700,

    height: 2200,

  });

  const previews: PreviewImage[] = [];

  for (let page = 1; page <= totalPages; page++) {
    console.log(`START PAGE ${page}/${totalPages}`);

    try {
      const result = await converter(page);

      console.log("CONVERT RESULT:", result);

      if (!result.path) {
        throw new Error(`Page ${page} conversion failed`);
      }

      const newPath = path.join(outputDir, `page-${page}.png`);

      await fs.rename(result.path, newPath);

      previews.push(buildPreviewUrl(pdfId, page));

      console.log(`PAGE ${page} DONE`);
    } catch (error: any) {
      console.log(`PAGE ${page} ERROR`);

      console.log(error.message);

      throw error;
    }
  }

  return {
    totalPages,

    previews,
  };
};
