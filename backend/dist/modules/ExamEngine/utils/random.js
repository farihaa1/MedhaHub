"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomItems = exports.getRandomNumber = void 0;
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomNumber = getRandomNumber;
const getRandomItems = (items, count) => {
    const shuffled = [...items].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};
exports.getRandomItems = getRandomItems;
//# sourceMappingURL=random.js.map