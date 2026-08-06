"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterController = void 0;
const chapter_service_1 = require("./chapter.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createChapter = async (req, res) => {
    try {
        const result = await chapter_service_1.ChapterService.createChapter(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Chapter created successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to create chapter",
            data: error,
        });
    }
};
const getAllChapters = async (_req, res) => {
    try {
        const result = await chapter_service_1.ChapterService.getAllChapters();
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Chapters retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve chapters",
            data: error,
        });
    }
};
const getSingleChapter = async (req, res) => {
    try {
        const result = await chapter_service_1.ChapterService.getSingleChapter(req.params.id);
        if (!result) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 404,
                message: "Chapter not found",
                data: undefined
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Chapter retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve chapter",
            data: error,
        });
    }
};
const getChaptersBySubject = async (req, res) => {
    console.log(req.params);
    try {
        const result = await chapter_service_1.ChapterService.getChaptersBySubject(req.params.subjectId);
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Chapters retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        throw error;
    }
};
const updateChapter = async (req, res) => {
    try {
        const result = await chapter_service_1.ChapterService.updateChapter(req.params.id, req.body);
        if (!result) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 404,
                message: "Chapter not found",
                data: undefined,
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Chapter updated successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to update chapter",
            data: error,
        });
    }
};
const deleteChapter = async (req, res) => {
    try {
        const result = await chapter_service_1.ChapterService.deleteChapter(req.params.id);
        if (!result) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 404,
                message: "Chapter not found",
                data: undefined,
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Chapter deleted successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to delete chapter",
            data: error,
        });
    }
};
exports.ChapterController = {
    createChapter,
    getAllChapters,
    getSingleChapter,
    updateChapter,
    deleteChapter,
    getChaptersBySubject,
};
//# sourceMappingURL=chapter.controller.js.map