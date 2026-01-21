"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTaskValidationRules = exports.createTaskValidationRules = exports.loginValidationRules = exports.registerValidationRules = exports.validators = exports.validate = void 0;
const errors_1 = require("./errors");
const validate = (data, rules) => {
    const errors = {};
    if (typeof data !== "object" || data === null) {
        throw new errors_1.BadRequest("Invalid request body");
    }
    const obj = data;
    for (const rule of rules) {
        const value = obj[rule.field];
        if (!rule.validate(value)) {
            errors[rule.field] = rule.message;
        }
    }
    if (Object.keys(errors).length > 0) {
        throw new errors_1.BadRequest("Validation failed", errors);
    }
};
exports.validate = validate;
// Common validators
exports.validators = {
    isEmail: (email) => {
        if (typeof email !== "string")
            return false;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    isPassword: (password) => {
        if (typeof password !== "string")
            return false;
        return password.length >= 6;
    },
    isString: (value) => typeof value === "string" && value.length > 0,
    isOptionalString: (value) => value === undefined || (typeof value === "string" && value.length > 0),
    isTaskStatus: (status) => status === "PENDING" || status === "COMPLETED",
};
exports.registerValidationRules = [
    {
        field: "email",
        validate: exports.validators.isEmail,
        message: "Invalid email format",
    },
    {
        field: "password",
        validate: exports.validators.isPassword,
        message: "Password must be at least 6 characters",
    },
    {
        field: "name",
        validate: exports.validators.isString,
        message: "Name is required and must be a non-empty string",
    },
];
exports.loginValidationRules = [
    {
        field: "email",
        validate: exports.validators.isEmail,
        message: "Invalid email format",
    },
    {
        field: "password",
        validate: exports.validators.isString,
        message: "Password is required",
    },
];
exports.createTaskValidationRules = [
    {
        field: "title",
        validate: exports.validators.isString,
        message: "Title is required and must be a non-empty string",
    },
    {
        field: "description",
        validate: exports.validators.isOptionalString,
        message: "Description must be a string if provided",
    },
];
exports.updateTaskValidationRules = [
    {
        field: "title",
        validate: (value) => exports.validators.isOptionalString(value),
        message: "Title must be a string if provided",
    },
    {
        field: "description",
        validate: (value) => exports.validators.isOptionalString(value),
        message: "Description must be a string if provided",
    },
    {
        field: "status",
        validate: (value) => value === undefined || exports.validators.isTaskStatus(value),
        message: "Status must be PENDING or COMPLETED",
    },
];
//# sourceMappingURL=validation.js.map