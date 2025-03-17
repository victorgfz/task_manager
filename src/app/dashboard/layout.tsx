
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { SidebarFormatted } from "@/components/pages/dashboard/sidebar-formatted";
import { auth } from "@/lib/auth";




type DashboardLayoutProps = {
    children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {

    const session = await auth()
    if (!session?.user) return null

    return (<div className="overflow-hidden h-screen w-full relative">
        <div
            className={cn(
                "flex flex-col md:flex-row overflow-hidden",
                "h-screen w-full"
            )}>
            <SidebarFormatted user={session.user} />
            <main className="w-full h-screen">{children}</main>
        </div>

        <Toaster />
        <InteractiveGridPattern
            width={40}
            height={40}
            squares={[48, 48]}
            className={cn(
                "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)] md:[mask-image:radial-gradient(800px_circle_at_center,white,transparent)]",
                "inset-x-0 inset-y-[-50%] md:inset-y-[-30%] h-[200%] skew-y-12 opacity-50 -z-10",
            )} />
    </div>

    );
}
