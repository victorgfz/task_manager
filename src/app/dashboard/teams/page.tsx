"use client"
import { CreateNewTeam } from "@/components/pages/teams/create-new-team";
import { TeamCard } from "@/components/pages/teams/team-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ShieldOff } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function TeamsPage() {

    const { data: teams, error, isLoading } = useSWR("/api/teams", fetcher)

    if (isLoading) return (
        <div className="w-full h-full py-4 px-8 border-l">
            <div className="flex items-center justify-between">
                <h1 className="font-bold text-4xl text-left">Times</h1>

            </div>
            <section className="max-h-[720px] md:max-h-[800px] py-4 mt-2 overflow-y-auto w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: 8 }, (i, idx) => idx).map((item, index) => <Skeleton key={index} className={cn("h-[200px] rounded-lg w-full")} />)}</section>
        </div>)

    if (error) return (<div
        className="w-full h-full p-8 flex flex-col gap-4 items-center justify-center border-l">
        <ShieldOff size={36} className="text-accent" />
        <h1 className="text-2xl max-w-[380px] text-center font-light">Algum erro inesperado ocorreu!</h1>
    </div>)

    return (<div className="w-full h-full py-4 px-8 border-l">
        <div className="flex items-center justify-between">
            <h1 className="font-bold text-4xl text-left">Times</h1>
            <CreateNewTeam />
        </div>
        <section className="max-h-[720px] md:max-h-[800px] py-4 mt-2 overflow-y-auto w-full grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {teams && teams.length > 0 ? teams.map((item: { id: string; title: string; type: string, role: string, membersCount: number }) => {
                return (<TeamCard id={item.id} key={item.id} name={item.title} type={item.type} membersCount={item.membersCount} role={item.role} />)
            }) : <p className="text-muted-foreground italic">Nenhum time criado/adicionado até o momento.</p>}


        </section>

    </div>)
}