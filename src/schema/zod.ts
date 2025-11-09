import { z } from "zod";
import { UserRole } from "@/generated/prisma";
import { content } from "@/content/text.content";

export const signInSchema = z.object({
    email: z.string({ message: content.validation.emailRequired })
        .min(1, content.validation.emailRequired)
        .email(content.validation.emailInvalid),
    password: z.string({ message: content.validation.passwordRequired })
        .min(1, content.validation.passwordRequired)
        .min(6, content.validation.passwordMin)
        .max(32, content.validation.passwordMax)
});

export const registerSchema = z.object({
    email: z.string({ message: content.validation.emailRequired })
        .min(1, content.validation.emailRequired)
        .email(content.validation.emailFormat),
    password: z.string({ message: content.validation.passwordRequired })
        .min(6, content.validation.passwordMin)
        .max(32, content.validation.passwordMax),
    confirmPassword: z.string({ message: content.validation.confirmPasswordRequired }),
    name: z.string()
        .min(2, content.validation.nameMinGeneric)
        .max(100, content.validation.nameMaxGeneric)
        .optional(),
    phone: z.string()
        .regex(/^\+?[0-9\s\-\(\)]{10,20}$/, content.validation.phoneFormat)
        .optional(),
    role: z.nativeEnum(UserRole, {
        message: content.validation.selectRole
    }).default(UserRole.OWNER),
}).refine((data) => data.password === data.confirmPassword, {
    message: content.validation.passwordMismatch,
    path: ["confirmPassword"],
});

export type SignInSchemaType = z.infer<typeof signInSchema>;
export type RegisterSchemaType = z.infer<typeof registerSchema>;
