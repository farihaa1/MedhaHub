"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShuffleService = void 0;
const modelTest_utils_1 = require("../../ModelTests/modelTest.utils");
const shuffleQuestions = (questions) => {
    return (0, modelTest_utils_1.shuffleArray)(questions);
};
const shuffleOptions = (options) => {
    return (0, modelTest_utils_1.shuffleArray)(options);
};
exports.ShuffleService = {
    shuffleQuestions,
    shuffleOptions,
};
//# sourceMappingURL=shuffle.service.js.map