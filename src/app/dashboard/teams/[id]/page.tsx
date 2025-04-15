"use client"
import { MembersList } from "@/components/pages/teams/team/members-list"
import { UserTasks } from "@/components/pages/teams/team/user-tasks"
import Link from "next/link"
import { Frown, MoveLeft, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

import { Separator } from "@/components/ui/separator"
import { useParams } from 'next/navigation'
import useSWR from "swr";


const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TeamPage() {

    const params = useParams()


    const { data, error, isLoading } = useSWR(`/api/teams/${params.id}`, fetcher)

    if (isLoading) return (<div className="w-full h-full p-8 flex flex-col gap-4 items-center justify-start border-l">
        <div className="flex items-center justify-center gap-4 w-full relative"> <h1 className="font-bold text-4xl text-center">Carregando...</h1></div>
        <Skeleton className="w-full rounded-md h-[100px]" />
        <Skeleton className="w-full rounded-md h-[200px]" /></div>)

    if (error) return (<div
        className="w-full h-full p-8 flex flex-col gap-4 items-center justify-center border-l">
        <ShieldOff size={36} className="text-accent" />
        <h1 className="text-2xl max-w-[380px] text-center font-light">Algum erro inesperado ocorreu!</h1>
        <Link href="/dashboard/teams">
            <Button
                className="text-md text-accent"
                variant="link">
                <MoveLeft size={16} /> Voltar
            </Button>
        </Link>
    </div>)

    if (!data.userIsMember) return (<div
        className="w-full h-full p-8 flex flex-col gap-4 items-center justify-center border-l">
        <Frown size={36} className="text-accent" />
        <h1 className="text-2xl max-w-[380px] text-center font-light">Você não faz mais parte dessa equipe ou ela foi deletada!</h1>
        <Link href="/dashboard/teams">
            <Button
                className="text-md text-accent"
                variant="link">
                <MoveLeft size={16} /> Voltar
            </Button>
        </Link>
    </div>)

    const userInfo = data.teamMembers.find((item: { userId: string }) => item.userId === data.userId)
    const userTasks = data.teamMembersTasks.filter((item: { userId: string }) => item.userId === data.userId)
    const membersWithoutUser = data.teamMembers.filter((item: { userId: string }) => item.userId !== data.userId)
    const membersTasks = data.teamMembersTasks.filter((item: { userId: string }) => item.userId !== data.userId)

    return (<div className="w-full h-full p-8 flex flex-col gap-4 items-center justify-start border-l">
        <div className="flex items-center justify-center gap-4 w-full relative">
            <Link href="/dashboard/teams">
                <Button
                    className="absolute left-0 -top-20 md:top-0 z-20 text-accent"
                    variant="link">
                    <MoveLeft size={16} /> Voltar
                </Button>
            </Link>

            <h1 className="font-bold text-4xl text-center">{data.team[0].title}</h1>
            <Separator orientation="vertical" className="bg-primary" />
            <p className="font-extralight text-2xl">{data.team[0].type}</p>



        </div>
        <UserTasks name={userInfo.name} role={userInfo.role} tasks={userTasks} teamMembers={data.teamMembers} teamId={userInfo.role === 'admin' ? data.team[0].id : undefined} teamMembersTasks={data.teamMembersTasks} teamProjects={data.teamProjects} />

        <MembersList members={membersWithoutUser} teamMembers={data.teamMembers} tasks={membersTasks} teamMembersTasks={data.teamMembersTasks} teamProjects={data.teamProjects} />

    </div>)
}