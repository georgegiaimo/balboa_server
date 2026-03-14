"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.loginUserSchema = exports.createUserSchema = exports.passwordSchema = exports.emailSchema = void 0;
const zod_1 = require("zod");
exports.emailSchema = zod_1.z
    .string()
    .min(1, { message: 'Email is required' })
    .max(254, { message: 'Email is too long (max 254 characters)' })
    .email({ message: 'Invalid email format' })
    .transform((email) => email.toLowerCase().trim());
exports.passwordSchema = zod_1.z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .max(128, { message: 'Password is too long (max 128 characters)' })
    .refine((password) => /\d/.test(password) && /[a-zA-Z]/.test(password), {
    message: 'Password must contain at least one letter and one number',
});
exports.createUserSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: exports.passwordSchema,
});
exports.loginUserSchema = zod_1.z.object({
    email: exports.emailSchema,
    password: zod_1.z.string().min(1, { message: 'Password is required' }), // 로그인시에는 기존 패스워드 검증 생략
});
exports.updateUserSchema = zod_1.z.object({
    email: exports.emailSchema.optional(),
    password: exports.passwordSchema.optional(),
});
//# sourceMappingURL=users.dto.js.map