"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_constants_1 = require("../users/user.constants");
const user_model_1 = require("../users/user.model");
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../config"));
const auth_utils_1 = require("./auth.utils");
const google_utils_1 = require("./google.utils");
const auth_constant_1 = require("./auth.constant");
/* =========================================================
   REGISTER
   Email + Password
========================================================= */
const register = async (payload) => {
    const existingUser = await user_model_1.User.findOne({
        email: payload.email.toLowerCase(),
    }).select("+password");
    if (existingUser) {
        throw new AppError_1.default(409, "Email already exists");
    }
    if (!payload.password) {
        throw new AppError_1.default(400, "Password is required for normal registration");
    }
    const hashedPassword = await (0, auth_utils_1.hashPassword)(payload.password);
    const user = await user_model_1.User.create({
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        avatar: payload.avatar,
        provider: auth_constant_1.AuthProvider.CREDENTIAL,
        role: user_constants_1.UserRole.USER,
        status: user_constants_1.UserStatus.ACTIVE,
        isVerified: false,
        points: 0,
    });
    const tokens = (0, auth_utils_1.generateAuthTokens)({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    const userObject = user.toObject();
    const { password, ...safeUser } = userObject;
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: safeUser,
    };
};
/* =========================================================
   LOGIN
   Email + Password

   IMPORTANT:
   We do NOT check provider here.

   If the user has a password, they can login
   using email + password.

   This means:

   Google account
        +
   later set password
        =
   Google + Password login
========================================================= */
const login = async (payload) => {
    const user = await user_model_1.User.findOne({
        email: payload.email.toLowerCase(),
    }).select("+password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status === user_constants_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(403, "User is blocked");
    }
    if (user.status === user_constants_1.UserStatus.DELETED) {
        throw new AppError_1.default(403, "User account has been deleted");
    }
    /*
     * We don't care whether provider is:
     *
     * credential
     * google
     *
     * If password exists, password login is allowed.
     */
    if (!user.password) {
        throw new AppError_1.default(400, "This account does not have a password. Please login with Google or set a password.");
    }
    const matched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!matched) {
        throw new AppError_1.default(401, "Incorrect password");
    }
    const tokens = (0, auth_utils_1.generateAuthTokens)({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    const userObject = user.toObject();
    const { password, ...safeUser } = userObject;
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: safeUser,
    };
};
/* =========================================================
   CHANGE PASSWORD

   Existing password required.
========================================================= */
const changePassword = async (email, oldPassword, newPassword) => {
    const user = await user_model_1.User.findOne({
        email: email.toLowerCase(),
    }).select("+password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status === user_constants_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(403, "User is blocked");
    }
    if (!user.password) {
        throw new AppError_1.default(400, "This account does not have a password. Please use set password.");
    }
    const matched = await (0, auth_utils_1.comparePassword)(oldPassword, user.password);
    if (!matched) {
        throw new AppError_1.default(401, "Old password is incorrect");
    }
    if (oldPassword === newPassword) {
        throw new AppError_1.default(400, "New password must be different from old password");
    }
    if (newPassword.length < 6) {
        throw new AppError_1.default(400, "Password must be at least 6 characters long");
    }
    const hashedPassword = await (0, auth_utils_1.hashPassword)(newPassword);
    user.password = hashedPassword;
    await user.save();
    return null;
};
/* =========================================================
   SET PASSWORD

   Used mainly for Google-only accounts.

   Google account:

   email
   googleId
   password = undefined

   After set password:

   email
   googleId
   password = hashed password

   Now both Google and normal login work.
========================================================= */
const setPassword = async (email, newPassword) => {
    const user = await user_model_1.User.findOne({
        email: email.toLowerCase(),
    }).select("+password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status === user_constants_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(403, "User is blocked");
    }
    if (user.password) {
        throw new AppError_1.default(400, "Password already exists. Please use change password.");
    }
    if (!newPassword || newPassword.length < 6) {
        throw new AppError_1.default(400, "Password must be at least 6 characters long.");
    }
    const hashedPassword = await (0, auth_utils_1.hashPassword)(newPassword);
    user.password = hashedPassword;
    /*
     * If this was a Google-only account,
     * provider can remain GOOGLE.
     *
     * provider represents original registration method.
     *
     * The actual available login methods are determined by:
     *
     * password exists
     * +
     * googleId exists
     */
    await user.save();
    return null;
};
/* =========================================================
   GET ME
========================================================= */
const getMe = async (email) => {
    const user = await user_model_1.User.findOne({
        email: email.toLowerCase(),
    }).select("-password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status === user_constants_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(403, "User is blocked");
    }
    if (user.status === user_constants_1.UserStatus.DELETED) {
        throw new AppError_1.default(403, "User account has been deleted");
    }
    return user;
};
/* =========================================================
   UPDATE PROFILE
========================================================= */
const updateProfile = async (email, payload) => {
    /*
     * NEVER allow profile endpoint to change:
     *
     * password
     * email
     * googleId
     * role
     * status
     * provider
     * points
     * isVerified
     */
    const safePayload = {};
    if (payload.name !== undefined) {
        safePayload.name = payload.name;
    }
    if (payload.avatar !== undefined) {
        safePayload.avatar = payload.avatar;
    }
    const user = await user_model_1.User.findOneAndUpdate({
        email: email.toLowerCase(),
    }, safePayload, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    return user;
};
/* =========================================================
   REFRESH TOKEN
========================================================= */
const refreshToken = async (token) => {
    if (!token) {
        throw new AppError_1.default(401, "Refresh token is required");
    }
    let decoded;
    try {
        decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwtRefreshSecret);
    }
    catch {
        throw new AppError_1.default(401, "Invalid or expired refresh token");
    }
    if (!decoded.id) {
        throw new AppError_1.default(401, "Invalid refresh token payload");
    }
    const user = await user_model_1.User.findById(decoded.id);
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    if (user.status === user_constants_1.UserStatus.BLOCKED) {
        throw new AppError_1.default(403, "User is blocked");
    }
    if (user.status === user_constants_1.UserStatus.DELETED) {
        throw new AppError_1.default(403, "User account has been deleted");
    }
    const tokens = (0, auth_utils_1.generateAuthTokens)({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    const userObject = user.toObject();
    const { password, ...safeUser } = userObject;
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: safeUser,
    };
};
/* =========================================================
   GOOGLE LOGIN
========================================================= */
const googleLogin = async (idToken) => {
    if (!idToken) {
        throw new AppError_1.default(400, "Google ID token is required");
    }
    /*
     * Verify token directly with Google.
     *
     * Never trust email/googleId sent by frontend.
     */
    const googleUser = await (0, google_utils_1.verifyGoogleIdToken)(idToken);
    if (!googleUser.email) {
        throw new AppError_1.default(401, "Google account email not found");
    }
    if (!googleUser.emailVerified) {
        throw new AppError_1.default(401, "Google email is not verified");
    }
    const email = googleUser.email.toLowerCase();
    /* =====================================================
       STEP 1
       Search by Google ID
    ===================================================== */
    let user = await user_model_1.User.findOne({
        googleId: googleUser.googleId,
    }).select("+password");
    /* =====================================================
       STEP 2
       If Google ID doesn't exist,
       search by email.
    ===================================================== */
    if (!user) {
        user = await user_model_1.User.findOne({
            email,
        }).select("+password");
    }
    /* =====================================================
       EXISTING USER
    ===================================================== */
    if (user) {
        if (user.status === user_constants_1.UserStatus.BLOCKED) {
            throw new AppError_1.default(403, "User is blocked");
        }
        if (user.status === user_constants_1.UserStatus.DELETED) {
            throw new AppError_1.default(403, "User account has been deleted");
        }
        /* =================================================
           GOOGLE ID SECURITY CHECK
    
           If this email is already connected to another
           Google account, reject it.
        ================================================= */
        if (user.googleId && user.googleId !== googleUser.googleId) {
            throw new AppError_1.default(409, "This email is already linked to another Google account.");
        }
        /* =================================================
           LINK GOOGLE TO EXISTING ACCOUNT
    
           Example:
    
           Existing credential account:
    
           email
           password
           googleId = undefined
    
           User clicks Google login.
    
           We add googleId.
    
           Result:
    
           email
           password
           googleId
    
           Now both login methods work.
        ================================================= */
        if (!user.googleId) {
            user.googleId = googleUser.googleId;
        }
        /*
         * Update avatar from Google if available.
         */
        if (googleUser.avatar) {
            user.avatar = googleUser.avatar;
        }
        /*
         * Google verified the email.
         */
        user.isVerified = true;
        await user.save();
    }
    /* =====================================================
       NEW GOOGLE USER
    ===================================================== */
    if (!user) {
        user = await user_model_1.User.create({
            name: googleUser.name,
            email,
            googleId: googleUser.googleId,
            avatar: googleUser.avatar,
            /*
             * No password initially.
             *
             * User can later use setPassword().
             */
            provider: auth_constant_1.AuthProvider.GOOGLE,
            role: user_constants_1.UserRole.USER,
            status: user_constants_1.UserStatus.ACTIVE,
            isVerified: true,
            points: 0,
        });
    }
    /* =====================================================
       GENERATE NORMAL JWT TOKENS
    ===================================================== */
    const tokens = (0, auth_utils_1.generateAuthTokens)({
        _id: user._id.toString(),
        email: user.email,
        role: user.role,
    });
    const userObject = user.toObject();
    const { password, ...safeUser } = userObject;
    return {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: safeUser,
    };
};
/* =========================================================
   EXPORT
========================================================= */
exports.AuthService = {
    register,
    login,
    changePassword,
    setPassword,
    getMe,
    updateProfile,
    refreshToken,
    googleLogin,
};
//# sourceMappingURL=auth.service.js.map