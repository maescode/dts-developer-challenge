"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskStatusValidation = exports.taskValidation = void 0;
const express_validator_1 = require("express-validator");
exports.taskValidation = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage('Title is required')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Title must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must not exceed 500 characters'),
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('Status is required')
        .trim()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be one of: pending, in-progress, completed'),
    (0, express_validator_1.body)('due_date')
        .notEmpty()
        .withMessage('Due date is required')
        .isISO8601()
        .withMessage('Due date must be a valid ISO 8601 date')
        .custom((value) => {
        const date = new Date(value);
        const now = new Date();
        if (date < now) {
            throw new Error('Due date must be in the future');
        }
        return true;
    })
];
exports.taskStatusValidation = [
    (0, express_validator_1.body)('status')
        .notEmpty()
        .withMessage('Status is required')
        .trim()
        .isIn(['pending', 'in-progress', 'completed'])
        .withMessage('Status must be one of: pending, in-progress, completed')
];
