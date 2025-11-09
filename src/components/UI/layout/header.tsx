"use client";

import { layoutConfig } from "@/config/layout.config";
import { siteConfig } from "@/config/site.config";
import { content } from "@/content/text.content";
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
    Button
} from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RegistrationModal from "../modals/registration.modal";
import LoginModal from "../modals/login.modal";
import { useState } from "react";
import { signOutFunc } from "@/actions/sign-out";
import { useAuthStore } from "@/store/auth.store";

export const Logo = () => {
    return (
        <Image
            src="/logo-new.png"
            alt={siteConfig.title}
            width={50}
            height={50}
            priority
            className="w-10 h-10 md:w-12 md:h-12"
        />
    );
};

export default function Header() {
    const pathname = usePathname();

    const { isAuth, session, status, setAuthState } = useAuthStore();

    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOutFunc();
        } catch (error) {
            console.error("error", error);
        }

        setAuthState("unauthenticated", null);
    };

    const getMenuItems = () => {
        // Add owner items if user is authenticated
        if (isAuth && session?.user) {
            return [...siteConfig.navItems, ...siteConfig.ownerNavItems];
        }

        return siteConfig.navItems;
    };

    const getNavItems = () => {
        return getMenuItems().map((item) => {
            const isActive = pathname === item.href;

            return (
                <NavbarItem key={item.href}>
                    <Link
                        color="foreground"
                        href={item.href}
                        className={`px-3 py-1 font-medium
          ${isActive ? "text-uzbek-burgundy border-b-2 border-uzbek-burgundy" : "text-foreground"}
              hover:text-uzbek-burgundy hover:bg-uzbek-burgundy/10
              hover:rounded-md
              transition-all
              duration-200`}
                    >
                        {item.label}
                    </Link>
                </NavbarItem>
            );
        });
    };

    return (
        <Navbar
            isMenuOpen={isMenuOpen}
            onMenuOpenChange={setIsMenuOpen}
            style={{ height: layoutConfig.headerHeight }}
            className="bg-white/80 backdrop-blur-md border-b-2 border-uzbek-burgundy/20 shadow-sm"
            maxWidth="full"
        >
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? content.nav.closeMenu : content.nav.openMenu}
                    className="sm:hidden text-uzbek-burgundy"
                />
                <NavbarBrand>
                    <Link href="/" className="flex gap-2 items-center">
                        <Logo />
                        <p className="font-bold text-uzbek-burgundy text-lg">{siteConfig.title}</p>
                    </Link>
                </NavbarBrand>
            </NavbarContent>

            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {getNavItems()}
            </NavbarContent>

            <NavbarContent justify="end">
                {status === "loading" ? (
                    <NavbarItem>
                        <span className="text-sm">{content.auth.loading}</span>
                    </NavbarItem>
                ) : !isAuth ? (
                    <>
                        {/* Login Button - Hidden on mobile */}
                        <NavbarItem className="hidden sm:flex">
                            <Button
                                color="secondary"
                                variant="flat"
                                onPress={() => setIsLoginOpen(true)}
                            >
                                {content.auth.login}
                            </Button>
                        </NavbarItem>
                        {/* Register Button */}
                        <NavbarItem>
                            <Button
                                color="primary"
                                variant="flat"
                                size="sm"
                                onPress={() => setIsRegistrationOpen(true)}
                            >
                                <span className="hidden sm:inline">{content.auth.register}</span>
                                <span className="sm:hidden">{content.auth.loginShort}</span>
                            </Button>
                        </NavbarItem>
                    </>
                ) : (
                    <>
                        {/* Greeting - Hidden on mobile */}
                        <NavbarItem className="hidden md:flex">
                            <span className="text-sm">{content.auth.greeting(session?.user?.email || '')}</span>
                        </NavbarItem>
                        {/* Logout Button */}
                        <NavbarItem>
                            <Button
                                color="secondary"
                                variant="flat"
                                size="sm"
                                onPress={handleSignOut}
                            >
                                {content.auth.logout}
                            </Button>
                        </NavbarItem>
                    </>
                )}
            </NavbarContent>

            {/* Mobile Menu */}
            <NavbarMenu className="bg-white pt-6">
                {getMenuItems().map((item, index) => {
                    const isActive = pathname === item.href;
                    return (
                        <NavbarMenuItem key={`${item.href}-${index}`}>
                            <Link
                                href={item.href}
                                className={`w-full px-4 py-3 rounded-lg font-medium text-lg
                                    ${isActive ? "bg-uzbek-burgundy text-white" : "text-gray-700 hover:bg-uzbek-burgundy/10 hover:text-uzbek-burgundy"}
                                    transition-all`}
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    );
                })}
            </NavbarMenu>

            <RegistrationModal
                isOpen={isRegistrationOpen}
                onClose={() => setIsRegistrationOpen(false)}
            />
            <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
        </Navbar>
    );
}