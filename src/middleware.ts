import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken, GetTokenParams } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, static files, and NextAuth
    if (
        pathname.startsWith('/api/') ||
        pathname.startsWith('/_next/') ||
        pathname.startsWith('/static/') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    let params: GetTokenParams = {
        req: request,
        secret: process.env.AUTH_SECRET ?? "secret"
    };

    if (process.env.NODE_ENV === "production") {
        params = {
            ...params,
            cookieName: "__Secure-authjs.session-token"
        };
    }

    const token = await getToken(params);

    // Protect all /owner/* routes - requires authentication
    if (pathname.startsWith('/owner')) {
        if (!token) {
            // Redirect to home if not authenticated
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
};