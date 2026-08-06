"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["USER"] = "user";
    UserRole["PREMIUM"] = "premium";
})(UserRole || (exports.UserRole = UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "active";
    UserStatus["BLOCKED"] = "blocked";
    UserStatus["DELETED"] = "deleted";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
//# sourceMappingURL=user.constants.js.map