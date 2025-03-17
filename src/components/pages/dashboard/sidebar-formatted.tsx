"use client"

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { UserInfo, UserInfoIcon } from "./user-info"
import { LayoutDashboard, LogOut, Settings } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/components/ui/themeToggle"
import { signOut } from "next-auth/react"
import { Session } from "next-auth"


type UserInfo = {
    user: Session["user"] | null
}


export const SidebarFormatted = ({ user }: UserInfo) => {

    const navItems = [
        {
            label: "Times",
            icon: (
                <LayoutDashboard className="group-hover/sidebar:text-accent h-5 w-5 flex-shrink-0" />
            ),
            href: "/dashboard/teams",
        },
        {
            label: "Bugs ou melhorias",
            icon: (
                <Settings className="group-hover/sidebar:text-accent h-5 w-5 flex-shrink-0" />
            ),
            href: "/dashboard/settings"
        },
        {
            label: "Sair",
            icon: (
                <LogOut className="group-hover/sidebar:text-accent h-5 w-5 flex-shrink-0" />
            ),
            onClick: () => { signOut({ callbackUrl: "/auth/login" }) }
        }
    ]

    const [open, setOpen] = useState(false);
    return <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 ">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
                {open ? <UserInfo user={user} /> : <UserInfoIcon user={user} />}
                <div className="mt-8 flex flex-col gap-2">
                    {navItems.map((item, index) => <SidebarLink link={item} key={index} />)}

                </div>

            </div>
            <ThemeToggle />


        </SidebarBody>
    </Sidebar>
}