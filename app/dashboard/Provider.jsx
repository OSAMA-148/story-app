import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import AppHeader from "./_components/AppHeader";

function DashboardProvider({ children }) {
    return (
        <div>
            <SidebarProvider>
                <AppSidebar />
                <div className="w-full">
                    <AppHeader />

                    {children}
                </div>
            </SidebarProvider>
        </div>
    );
}

export default DashboardProvider;
