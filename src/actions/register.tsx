"use server";

import { registerSchema, RegisterSchemaType } from "@/schema/zod";
import { saltAndHashPassword } from "@/utils/password";
import prisma from "@/utils/prisma";
import { UserRole } from "@/generated/prisma";
import { content } from "@/content/text.content";

export async function registerUser(formData: RegisterSchemaType) {
    // Validate with Zod
    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
        return {
            error: validation.error.issues[0]?.message || content.validation.validationError
        };
    }

    const { email, password, name, phone, role } = validation.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return { error: content.auth.userExists };
        }

        const pwHash = await saltAndHashPassword(password);

        const user = await prisma.user.create({
            data: {
                email,
                password: pwHash,
                name: name || null,
                phone: phone || null,
                role: role || UserRole.OWNER,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            }
        });

        return { success: true, user };
    } catch (error) {
        console.error("Registration error:", error);
        return { error: content.auth.registrationError };
    }
}