"use server";

import { signIn } from "@/auth/auth";
import { AuthError } from "next-auth";
import { content } from "@/content/text.content";

export async function signInWithCredentials(email: string, password: string) {
    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false
        });

        if (!result) {
            return { success: false, error: content.auth.invalidCredentials };
        }

        return { success: true };
    } catch (error) {
        console.error("Ошибка авторизации:", error);

        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { success: false, error: content.auth.invalidCredentials };
                default:
                    return { success: false, error: content.auth.signInError };
            }
        }

        return { success: false, error: content.auth.signInError };
    }
}