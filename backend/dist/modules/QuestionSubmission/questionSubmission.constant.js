"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTRIBUTOR_REWARD = exports.SubmissionType = exports.SubmissionStatus = void 0;
var SubmissionStatus;
(function (SubmissionStatus) {
    SubmissionStatus["PENDING"] = "pending";
    SubmissionStatus["APPROVED"] = "approved";
    SubmissionStatus["REJECTED"] = "rejected";
})(SubmissionStatus || (exports.SubmissionStatus = SubmissionStatus = {}));
var SubmissionType;
(function (SubmissionType) {
    SubmissionType["NEW"] = "NEW";
    SubmissionType["UPDATE"] = "UPDATE";
})(SubmissionType || (exports.SubmissionType = SubmissionType = {}));
exports.CONTRIBUTOR_REWARD = 10;
//# sourceMappingURL=questionSubmission.constant.js.map