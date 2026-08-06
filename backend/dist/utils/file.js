"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileSize = exports.fileExists = exports.deleteFile = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const deleteFile = async (filePath) => {
    try {
        await promises_1.default.unlink(filePath);
    }
    catch {
        // Ignore if file does not exist
    }
};
exports.deleteFile = deleteFile;
const fileExists = async (filePath) => {
    try {
        await promises_1.default.access(filePath);
        return true;
    }
    catch {
        return false;
    }
};
exports.fileExists = fileExists;
const getFileSize = async (filePath) => {
    const stat = await promises_1.default.stat(filePath);
    return stat.size;
};
exports.getFileSize = getFileSize;
//# sourceMappingURL=file.js.map