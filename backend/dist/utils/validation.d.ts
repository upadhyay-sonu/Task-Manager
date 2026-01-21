export interface ValidationRule {
    field: string;
    validate: (value: unknown) => boolean;
    message: string;
}
export declare const validate: (data: unknown, rules: ValidationRule[]) => void;
export declare const validators: {
    isEmail: (email: unknown) => boolean;
    isPassword: (password: unknown) => boolean;
    isString: (value: unknown) => boolean;
    isOptionalString: (value: unknown) => boolean;
    isTaskStatus: (status: unknown) => boolean;
};
export declare const registerValidationRules: ValidationRule[];
export declare const loginValidationRules: ValidationRule[];
export declare const createTaskValidationRules: ValidationRule[];
export declare const updateTaskValidationRules: ValidationRule[];
//# sourceMappingURL=validation.d.ts.map