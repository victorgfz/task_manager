"use client"

import { Separator } from "@/components/ui/separator"
import { UserTasksItem } from "./user-tasks-item"
import { ManageTeamMembers } from "@/components/pages/teams/team/manage-team-members"
import { CreateNewTask } from "@/components/pages/teams/team/create-new-task"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { deleteTeam } from "@/db/actions"
import { useRouter } from "next/navigation"
import { mutate } from "swr"


type UserTasksProps = {
    name: string,
    role: string,
    tasks: TasksProps[],
    teamMembers: TeamMember[],
    teamId: string
}

type TasksProps = {
    id: string;
    userId: string;
    situation: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

type TeamMember = {
    userId: string
    name: string,
    role: string
}

export const UserTasks = ({ name, role, tasks, teamMembers, teamId }: UserTasksProps) => {
    const router = useRouter()
    const handleDelete = async () => {
        try {
            await deleteTeam(teamId)
            toast({
                description: "Time deletado com sucesso!"
            })
            mutate(`/api/teams/${teamId}`)
            router.replace("/dashboard/teams")
        } catch (error) {
            console.error(error)
            toast({
                description: "Erro ao deletar time."
            })
        }
    }

    const { toast } = useToast()

    return (<section className="w-full border border-muted rounded-md p-4 bg-background">
        <div className="flex items-center justify-start gap-4 mb-4">
            <div className="flex flex-col lg:flex-row  gap-1 lg:gap-4 jusitfy-center lg:justify-start items-start lg:items-center flex-1">
                <h2 className="font-bold capitalize ">{name}</h2>

                <p className="text-muted-foreground capitalize">{role === "admin" ? <>Administrador</> : <>Membro</>}</p>
            </div>

            {role === "admin" &&
                <div className="flex gap-4 items-center justify-center">
                    <CreateNewTask teamId={teamId} teamMembers={teamMembers} />
                    <ManageTeamMembers teamId={teamId} teamMembers={teamMembers} />
                    <form action={handleDelete}><Button variant="destructive"><X size={16} /><p className="hidden md:block">Deletar time</p></Button></form>

                </div>}

        </div>
        <Separator className="mb-4" />
        <ul className="flex flex-col items-start gap-2">

            {tasks && tasks.length > 0 ? tasks.map(item => {
                return (<UserTasksItem teamId={teamId} createdAt={item.createdAt} updatedAt={item.updatedAt} key={item.id} id={item.id} description={item.description} situation={item.situation} />)
            }) : <p className="text-muted-foreground italic">Nenhuma tarefa recebida/adiciona até o momento.</p>}
        </ul>

    </section >)
}