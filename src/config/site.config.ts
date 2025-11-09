import { content } from "@/content/text.content";

export const siteConfig = {
    title: content.site.title,
    description: content.site.description,
    navItems : [
        {href: "/", label: content.nav.home, roles: ["ALL"]},
        {href: "/about", label: content.nav.about, roles: ["ALL"]},
    ],
    ownerNavItems: [
        {href: "/owner/dashboard", label: content.nav.dashboard, roles: ["OWNER"]},
        {href: "/owner/my-restaurants", label: content.nav.myRestaurants, roles: ["OWNER"]},
    ],
}