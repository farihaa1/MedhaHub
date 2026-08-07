"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const router_1 = __importDefault(require("./router/router"));
const AppError_1 = __importDefault(require("./error/AppError"));
const app = (0, express_1.default)();
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
];
if (process.env.CLIENT_URL) {
    allowedOrigins.push(process.env.CLIENT_URL);
}
app.use((0, cors_1.default)({
    origin(origin, callback) {
        // Allow Postman/server requests
        if (!origin) {
            return callback(null, true);
        }
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api/v1", router_1.default);
app.get("/", (_req, res) => {
    res.json({
        success: true,
        message: "Quizzes API Running",
    });
});
app.use((error, _req, res, _next) => {
    if (error instanceof mongoose_1.default.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: error.errors,
        });
    }
    if (error instanceof AppError_1.default) {
        return res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
    }
    if (error instanceof Error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map