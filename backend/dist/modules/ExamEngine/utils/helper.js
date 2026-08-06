"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmpty = exports.removeDuplicates = exports.chunkArray = void 0;
const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
};
exports.chunkArray = chunkArray;
const removeDuplicates = (array) => {
    return [...new Set(array)];
};
exports.removeDuplicates = removeDuplicates;
const isEmpty = (value) => {
    return value === undefined || value === null || value === "";
};
exports.isEmpty = isEmpty;
//# sourceMappingURL=helper.js.map