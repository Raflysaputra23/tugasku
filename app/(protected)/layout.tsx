import AppSidebar from "@/components/dashboard/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <SidebarProvider>
            <div className="min-h-dvh flex w-full">
                <AppSidebar />
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-14 flex items-center border-b px-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
                        <SidebarTrigger className="mr-4" />
                        <div className="flex-1" />
                    </header>
                    <main className="flex-1 p-4 md:p-6 lg:p-8 animate-fade-in">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default DashboardLayout;
