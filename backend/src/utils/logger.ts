import { TPdfLogLevel } from "../modules/pdfImport/pdfImport.constant";
import { IPdfImport } from "../modules/pdfImport/pdfImport.interface";

export const addImportLog = (
  pdfImport: IPdfImport,
  level: TPdfLogLevel,
  message: string,
): void => {
  pdfImport.logs.push({
    timestamp: new Date(),
    level,
    message,
  });
};

export const addInfoLog = (pdfImport: IPdfImport, message: string): void => {
  addImportLog(pdfImport, "INFO", message);
};

export const addWarningLog = (pdfImport: IPdfImport, message: string): void => {
  addImportLog(pdfImport, "WARNING", message);
};

export const addErrorLog = (pdfImport: IPdfImport, message: string): void => {
  addImportLog(pdfImport, "ERROR", message);
};
