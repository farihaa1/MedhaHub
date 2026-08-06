"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const router_1 = __importDefault(require("./router/router"));
const AppError_1 = __importDefault(require("./error/AppError"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:3000",
        "http://localhost:5173",
        process.env.CLIENT_URL,
    ],
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api/v1", router_1.default);
app.get("/mongo", async (_req, res) => {
    try {
        res.json({
            readyState: mongoose_1.default.connection.readyState,
            db: mongoose_1.default.connection.db?.databaseName ?? null,
        });
    }
    catch (err) {
        res.json(err);
    }
});
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Quizzes api",
    });
});
app.use((error, req, res, next) => {
    void req;
    void next;
    if (error instanceof mongoose_1.default.Error.ValidationError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: {
                name: error.name,
                errors: error.errors,
            },
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
        message: "Something went wrong",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map