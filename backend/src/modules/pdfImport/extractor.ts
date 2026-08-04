import { PDFDocumentProxy } from "pdfjs-dist";

import { loadPdf } from "./extractor/pdfLoader";
import { isDigitalPage } from "./extractor/hybridExtractor";
import { extractTextFromPage } from "./extractor/hybridExtractor";

import { runOCR } from "./extractor/ocr";

import { extractPageImages } from "./extractor/imageExtractor";

import { ExtractedPage, ExtractionResult } from "./extractor/extractor.types";

/**
 * Main PDF Extraction Pipeline
 */
export const extractPdf = async (
  filePath: string,
): Promise<ExtractionResult> => {
  const pdf: PDFDocumentProxy = await loadPdf(filePath);

  const pages: ExtractedPage[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    console.log(`Extracting page ${pageNumber}/${pdf.numPages}`);

    const page = await pdf.getPage(pageNumber);

    let text = "";
    let method: "TEXT" | "OCR" | "HYBRID" = "TEXT";

    /**
     * Step 1:
     * Check digital PDF page
     */
    const digital = await isDigitalPage(page);

    if (digital) {
      /**
       * Direct text extraction
       */
      text = await extractTextFromPage(page);

      method = "TEXT";
    } else {
      /**
       * Scanned image PDF
       * Use OCR
       */
      console.log(`OCR processing page ${pageNumber}`);

      text = await runOCR(page, pageNumber);

      method = "OCR";
    }

    /**
     * Step 2:
     * Extract diagrams/images
     */
    const images = await extractPageImages(page, pageNumber);

    pages.push({
      pageNumber,

      text,

      images,

      method,

      confidence: text.length > 30 ? 0.9 : 0.5,
    });
  }

  return {
    totalPages: pdf.numPages,

    pages,
  };
};
