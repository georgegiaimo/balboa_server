import { z } from 'zod';
export declare const emailSchema: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
export declare const passwordSchema: z.ZodString;
export declare const createUserSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strip>;
export type CreateUserDto = z.infer<typeof createUserSchema>;
export declare const loginUserSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    password: z.ZodString;
}, z.core.$strip>;
export type LoginUserDto = z.infer<typeof loginUserSchema>;
export declare const updateUserSchema: z.ZodObject<{
    email: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
