"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("../app"));
const config_1 = __importDefault(require("../config"));
let isConnected = false;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handler(req, res) {
    if (!isConnected) {
        await mongoose_1.default.connect(config_1.default.mongoUri);
        isConnected = true;
    }
    return (0, app_1.default)(req, res);
}
//# sourceMappingURL=index.js.map