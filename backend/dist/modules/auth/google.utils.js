"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogleIdToken = void 0;
const google_auth_library_1 = require("google-auth-library");
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const googleClient = new google_auth_library_1.OAuth2Client(config_1.default.googleClientId);
const verifyGoogleIdToken = async (idToken) => {
    if (!idToken) {
        throw new AppError_1.default(401, "Google ID token is required");
    }
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: config_1.default.googleClientId,
        });
        const payload = ticket.getPayload();
        if (!payload) {
            throw new AppError_1.default(401, "Invalid Google token");
        }
        if (!payload.sub) {
            throw new AppError_1.default(401, "Google account ID is missing");
        }
        if (!payload.email) {
            throw new AppError_1.default(401, "Google email is missing");
        }
        return {
            googleId: payload.sub,
            email: payload.email.toLowerCase(),
            name: payload.name || payload.email.split("@")[0],
            avatar: payload.picture || "",
            emailVerified: payload.email_verified === true,
        };
    }
    catch (error) {
        if (error instanceof AppError_1.default) {
            throw error;
        }
        throw new AppError_1.default(401, "Invalid or expired Google token");
    }
};
exports.verifyGoogleIdToken = verifyGoogleIdToken;
//# sourceMappingURL=google.utils.js.map