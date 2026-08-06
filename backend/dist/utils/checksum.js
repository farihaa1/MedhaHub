"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateChecksum = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
const generateChecksum = (filePath) => {
    return new Promise((resolve, reject) => {
        const hash = crypto_1.default.createHash("sha256");
        const stream = fs_1.default.createReadStream(filePath);
        stream.on("data", (chunk) => {
            hash.update(chunk);
        });
        stream.on("end", () => {
            resolve(hash.digest("hex"));
        });
        stream.on("error", (error) => {
            reject(error);
        });
    });
};
exports.generateChecksum = generateChecksum;
//# sourceMappingURL=checksum.js.map