"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthProvider = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["ACCESS"] = "access";
    TokenType["REFRESH"] = "refresh";
})(TokenType || (exports.TokenType = TokenType = {}));
var AuthProvider;
(function (AuthProvider) {
    AuthProvider["CREDENTIAL"] = "credential";
    AuthProvider["GOOGLE"] = "google";
})(AuthProvider || (exports.AuthProvider = AuthProvider = {}));
//# sourceMappingURL=auth.constant.js.map