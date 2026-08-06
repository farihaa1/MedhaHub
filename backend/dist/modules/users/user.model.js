"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
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
    password: {
        type: String,
        required: function () {
            return this.provider === auth_constant_1.AuthProvider.CREDENTIAL;
        },
        select: false,
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
    provider: {
        type: String,
        enum: Object.values(auth_constant_1.AuthProvider),
        default: auth_constant_1.AuthProvider.CREDENTIAL,
    },
    avatar: {
        type: String,
        default: "",
    },
    phone: {
        type: String,
        default: "",
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
// Remove password after saving
userSchema.post("save", function (doc, next) {
    doc.password = "";
    next();
});
// Static method
userSchema.statics.isUserExistsByEmail = function (email) {
    return this.findOne({ email }).select("+password");
};
exports.User = (0, mongoose_1.model)("User", userSchema);
//# sourceMappingURL=user.model.js.map