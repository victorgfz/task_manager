import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import Link from "next/link"

type TeamCardProps = {
    name: string,
    type: string,
    id: string,
    membersCount: number,
    role: string
}

export const TeamCard = ({ name, type, id, role, membersCount }: TeamCardProps) => {

    return (<Link
        href={`/dashboard/teams/${id}`} className={cn("cursor-pointer group/card relative p-4 h-[200px] border-muted border rounded-lg flex flex-col justify-center overflow-hidden")}>


        <div className="z-10 relative flex-1">
            <h2 className="text-2xl font-bold group-hover/card:translate-x-2 transition duration-300 ">
                {name}
            </h2>
            <p className="font-light text-sm text-muted-foreground" >
                {type}
            </p>
            <div className="absolute -left-4 inset-y-0 h-10 group-hover/card:w-2 w-1 rounded-tr-full rounded-br-full bg-muted  group-hover/card:bg-accent transition-all duration-300 origin-center" />

        </div>
        <div className="flex items-center justify-start gap-2 font-extralight text-sm">
            <p >{role === "admin" ? <>Administrador</> : <>Membro</>}</p><Separator className="bg-muted group-hover/card:bg-accent duration-300 transition-colors" orientation="vertical" /><p>{membersCount && membersCount > 1 ? `+ ${membersCount - 1} membros` : `Nenhum outro membro`}</p>
        </div>
        <div className="opacity-0 group-hover/card:opacity-70 transition duration-300 absolute inset-0 h-full w-full bg-gradient-to-b from-muted to-transparent" />
    </Link >)
}