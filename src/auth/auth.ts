import bcryptjs from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "@/schema/zod";
import { getUserFromDb } from "@/utils/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Account",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }

                    const { email, password } = await signInSchema.parseAsync(
                        credentials
                    );

                    const user = await getUserFromDb(email);

                    if (!user || !user.password) {
                        return null;
                    }

                    const isPasswordValid = await bcryptjs.compare(
                        password,
                        user.password
                    );

                    if (!isPasswordValid) {
                        return null;
                    }

                    return {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                        name: user.name
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/',
    },
    session: {
        strategy: "jwt",
        maxAge: 3600
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role;
                session.user.name = token.name as string;
            }
            return session;
        }
    }
});