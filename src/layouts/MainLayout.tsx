import React from "react";
import Header from "../components/Header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen flex-col">
        <Header />

        <div className="flex flex-1">
          <AppSidebar />

          <main className="flex-1 p-4">
            <SidebarTrigger className="mb-2 "/>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;