import { BadRequest } from "./errors";

export interface ValidationRule {
  field: string;
  validate: (value: unknown) => boolean;
  message: string;
}

export const validate = (data: unknown, rules: ValidationRule[]): void => {
  const errors: Record<string, string> = {};

  if (typeof data !== "object" || data === null) {
    throw new BadRequest("Invalid request body");
  }

  const obj = data as Record<string, unknown>;

  for (const rule of rules) {
    const value = obj[rule.field];
    if (!rule.validate(value)) {
      errors[rule.field] = rule.message;
    }
  }

  if (Object.keys(errors).length > 0) {
    throw new BadRequest("Validation failed", errors);
  }
};

// Common validators
export const validators = {
  isEmail: (email: unknown): boolean => {
    if (typeof email !== "string") return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  isPassword: (password: unknown): boolean => {
    if (typeof password !== "string") return false;
    return password.length >= 6;
  },

  isString: (value: unknown): boolean => typeof value === "string" && value.length > 0,

  isOptionalString: (value: unknown): boolean => value === undefined || (typeof value === "string" && value.length > 0),

  isTaskStatus: (status: unknown): boolean =>
    status === "PENDING" || status === "COMPLETED",
};

export const registerValidationRules: ValidationRule[] = [
  {
    field: "email",
    validate: validators.isEmail,
    message: "Invalid email format",
  },
  {
    field: "password",
    validate: validators.isPassword,
    message: "Password must be at least 6 characters",
  },
  {
    field: "name",
    validate: validators.isString,
    message: "Name is required and must be a non-empty string",
  },
];

export const loginValidationRules: ValidationRule[] = [
  {
    field: "email",
    validate: validators.isEmail,
    message: "Invalid email format",
  },
  {
    field: "password",
    validate: validators.isString,
    message: "Password is required",
  },
];

export const createTaskValidationRules: ValidationRule[] = [
  {
    field: "title",
    validate: validators.isString,
    message: "Title is required and must be a non-empty string",
  },
  {
    field: "description",
    validate: validators.isOptionalString,
    message: "Description must be a string if provided",
  },
];

export const updateTaskValidationRules: ValidationRule[] = [
  {
    field: "title",
    validate: (value) => validators.isOptionalString(value),
    message: "Title must be a string if provided",
  },
  {
    field: "description",
    validate: (value) => validators.isOptionalString(value),
    message: "Description must be a string if provided",
  },
  {
    field: "status",
    validate: (value) =>
      value === undefined || validators.isTaskStatus(value),
    message: "Status must be PENDING or COMPLETED",
  },
];
