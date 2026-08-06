"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addErrorLog = exports.addWarningLog = exports.addInfoLog = exports.addImportLog = void 0;
const addImportLog = (pdfImport, level, message) => {
    pdfImport.logs.push({
        timestamp: new Date(),
        level,
        message,
    });
};
exports.addImportLog = addImportLog;
const addInfoLog = (pdfImport, message) => {
    (0, exports.addImportLog)(pdfImport, "INFO", message);
};
exports.addInfoLog = addInfoLog;
const addWarningLog = (pdfImport, message) => {
    (0, exports.addImportLog)(pdfImport, "WARNING", message);
};
exports.addWarningLog = addWarningLog;
const addErrorLog = (pdfImport, message) => {
    (0, exports.addImportLog)(pdfImport, "ERROR", message);
};
exports.addErrorLog = addErrorLog;
//# sourceMappingURL=logger.js.map