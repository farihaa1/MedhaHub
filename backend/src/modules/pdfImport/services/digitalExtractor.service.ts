import fs from "fs/promises";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";

import { IPdfPage } from "../pdfImport.interface";

export interface IExtractedPdf {
  totalPages: number;
  pages: IPdfPage[];
}

interface TextItem {
  str: string;
  transform: number[];
}

const groupTextIntoLines = (items: TextItem[]) => {
  const tolerance = 3;

  const rows = new Map<number, TextItem[]>();

  for (const item of items) {
    const y = item.transform[5];

    let key: number | undefined;

    for (const existing of rows.keys()) {
      if (Math.abs(existing - y) <= tolerance) {
        key = existing;
        break;
      }
    }

    if (key === undefined) {
      key = y;
      rows.set(key, []);
    }

    rows.get(key)!.push(item);
  }

  return [...rows.entries()]
    .sort((a, b) => b[0] - a[0]) // top -> bottom
    .map(([_, row]) =>
      row
        .sort((a, b) => a.transform[4] - b.transform[4]) // left -> right
        .map((x) => x.str)
        .join(" "),
    )
    .join("\n");
};

const extract = async (pdfPath: string): Promise<IExtractedPdf> => {
  const buffer = await fs.readFile(pdfPath);

  const pdf = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  const pages: IPdfPage[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({
      scale: 1,
    });

    const textContent = await page.getTextContent();

    const text = groupTextIntoLines(textContent.items as TextItem[]);

    pages.push({
      pageNumber,

      text,

      width: viewport.width,

      height: viewport.height,
    });
  }

  return {
    totalPages: pdf.numPages,
    pages,
  };
};

export const DigitalExtractorService = {
  extract,
};
