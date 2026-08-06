"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubjectController = void 0;
const subject_service_1 = require("./subject.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createSubject = async (req, res) => {
    try {
        const result = await subject_service_1.SubjectService.createSubject(req.body);
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Subject created successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to create subject",
            data: error,
        });
    }
};
const getAllSubjects = async (_req, res) => {
    console.log("CONTROLLER START");
    const result = await subject_service_1.SubjectService.getAllSubjects();
    console.log("CONTROLLER GOT RESULT");
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Subjects retrieved successfully",
        data: result,
    });
    console.log("RESPONSE SENT");
};
const getSingleSubject = async (req, res) => {
    try {
        const slug = req.params.slug;
        const result = await subject_service_1.SubjectService.getSingleSubject(slug);
        if (!result) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 404,
                message: "Subject not found",
                data: null,
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Subject retrieved successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to retrieve subject",
            data: error,
        });
    }
};
const updateSubject = async (req, res) => {
    try {
        const result = await subject_service_1.SubjectService.updateSubject(req.params.slug, req.body);
        if (!result) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 404,
                message: "Subject not found",
                data: null,
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Subject updated successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to update subject",
            data: error,
        });
    }
};
const deleteSubject = async (req, res) => {
    try {
        const result = await subject_service_1.SubjectService.deleteSubject(req.params.slug);
        if (!result) {
            return (0, sendResponse_1.sendResponse)(res, {
                success: false,
                statusCode: 404,
                message: "Subject not found",
                data: null,
            });
        }
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Subject deleted successfully",
            data: result,
        });
    }
    catch (error) {
        (0, sendResponse_1.sendResponse)(res, {
            success: false,
            statusCode: 500,
            message: "Failed to delete subject",
            data: error,
        });
    }
};
exports.SubjectController = {
    createSubject,
    getAllSubjects,
    getSingleSubject,
    updateSubject,
    deleteSubject,
};
//# sourceMappingURL=subject.controller.js.map