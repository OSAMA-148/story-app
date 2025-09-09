"use client";
import { Button } from "@/components/ui/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Book, LayoutDashboardIcon, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function AppSidebar() {
    const path = usePathname();

    const menu = [
        {
            title: "Dashboard",
            icon: LayoutDashboardIcon,
            path: "/dashboard",
        },

        {
            title: "My Stories",
            icon: Book,
            path: "/dashboard/my-stories",
        },

        {
            title: "Setting",
            icon: Settings,
            path: "/settings",
        },
    ];
    return (
        <Sidebar>
            <SidebarHeader className="flex items-center justify-center">
                <Image src="/logo.png" alt="Logo" width={150} height={150} />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <Button>Genereate Your Story</Button>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menu.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton className=" h-20 ">
                                        <Link
                                            href={item.path}
                                            className={` w-full   p-3 flex items-center gap-2 mt-4 ml-4 ${
                                                path === item.path &&
                                                "bg-[#f4dce7] text-white rounded-lg"
                                            }`}
                                        >
                                            <item.icon className="text-[#c9749d] " />
                                            <p className="text-lg text-gray-600">
                                                {" "}
                                                {item.title}
                                            </p>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter />
        </Sidebar>
    );
}
