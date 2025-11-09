import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/UI/layout/header";
import { Providers } from "@/providers/provider";
import { siteConfig } from "@/config/site.config";
import { content } from "@/content/text.content";
import { layoutConfig } from "@/config/layout.config";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth/auth";
import AppLoader from "@/hoc/app-loader";


const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: siteConfig.title,
    description: siteConfig.description,
    colorScheme: 'light'
};

export default async function RootLayout({
                                             children
                                         }: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();

    return (
        <html lang="en" className="light">
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Providers>
            <SessionProvider session={session}>
                <AppLoader>
                    <div className="flex min-h-screen flex-col justify-between">
                        <div className="flex flex-col">
                            <Header />
                            <main
                                className={`flex flex-col max-w-[1024px] mx-auto px-[24px] justify-start items-center`}
                            >
                                {children}
                            </main>
                        </div>

                        <footer
                            className={`w-full border-t-2 border-uzbek-turquoise/20 bg-white py-6`}
                            style={{ minHeight: layoutConfig.footerHeight }}
                        >
                            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                    <p className="text-gray-600 text-sm sm:text-base text-center sm:text-left">
                                        {content.site.description}
                                    </p>
                                    <p className="text-gray-500 text-xs sm:text-sm">
                                        {content.site.copyright(2025)}
                                    </p>
                                </div>
                            </div>
                        </footer>
                    </div>
                </AppLoader>
            </SessionProvider>
        </Providers>
        </body>
        </html>
    );
}