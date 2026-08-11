"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const user_constants_1 = require("./user.constants");
const auth_constant_1 = require("../auth/auth.constant");
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    /**
     * Password is optional because
     * Google users may not have one initially.
     */
    password: {
        type: String,
        required: false,
        select: false,
    },
    /**
     * Google's stable account ID.
     *
     * sparse allows multiple users to have
     * undefined googleId.
     */
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    avatar: {
        type: String,
        default: "",
    },
    /**
     * Original registration provider.
     *
     * credential = registered with email/password
     * google     = registered with Google
     */
    provider: {
        type: String,
        enum: Object.values(auth_constant_1.AuthProvider),
        required: true,
    },
    role: {
        type: String,
        enum: Object.values(user_constants_1.UserRole),
        default: user_constants_1.UserRole.USER,
    },
    status: {
        type: String,
        enum: Object.values(user_constants_1.UserStatus),
        default: user_constants_1.UserStatus.ACTIVE,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    points: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
/**
 * Find user by email and explicitly include password.
 *
 * Normally password has select:false.
 */
userSchema.statics.isUserExistsByEmail = function (email) {
    return this.findOne({
        email: email.toLowerCase(),
    }).select("+password");
};
/**
 * Prevent OverwriteModelError during development
 * / Next.js-style hot reload environments.
 */
exports.User = mongoose_1.default.models.User || mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=user.model.js.map