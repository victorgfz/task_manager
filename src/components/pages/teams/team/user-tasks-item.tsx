"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { deleteProject, deleteTask, updateTaskSituation } from "@/db/actions"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale"
import { ArrowRight, Trash, User2 } from "lucide-react"
import { mutate } from "swr"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


type UserTasksItemProps = {
    teamId: string,
    id: string,
    description: string,
    priority: number,
    situation: string,
    createdAt: Date,
    updatedAt: Date,
    projectId: string | null;
    index: number | null;
    teamMembersTasks: TasksProps[],
    teamMembers: TeamMember[],
    projectName: string
}

type TasksProps = {
    id: string;
    userId: string;
    situation: string;
    description: string;
    priority: number;
    createdAt: Date;
    updatedAt: Date;
    projectId: string | null;
    index: number | null;
}

type TeamMember = {
    userId: string
    name: string,
    role: string,
    image: string,
}


export const UserTasksItem = ({ teamId, id, description, priority, situation, updatedAt, createdAt, projectId, teamMembersTasks, teamMembers, projectName }: UserTasksItemProps) => {



    const [button, setButton] = useState("Iniciar")
    const [btnBackground, setBtnBackground] = useState("bg-green-600/70")
    const [btnHover, setBtnHover] = useState("hover:bg-green-600")
    const [hover, setHover] = useState("hover:bg-green-600/10")
    const [priorityBackground, setPriorityBackground] = useState("bg-primary/70")
    const [projectTasks, setProjectTasks] = useState(teamMembersTasks)
    const dateCreate = formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })
    const dateUpdate = formatDistanceToNow(updatedAt, { addSuffix: true, locale: ptBR })

    useEffect(() => {
        switch (situation) {
            case "in_progress":
                setButton("Concluir");
                setBtnBackground("bg-yellow-600/70")
                setBtnHover("hover:bg-yellow-600")
                setHover("hover:bg-yellow-600/10")
                break;
            case "done":
                setButton("Concluída");
                setBtnBackground("bg-red-600/70")
                setBtnHover("hover:bg-red-600")
                setHover("hover:bg-red-600/10")
                break;
        }
        switch (priority) {
            case 1:
                setPriorityBackground("bg-primary/50")
                break;
            case 2:
                setPriorityBackground("bg-primary/70")
                break;
            case 3:
                setPriorityBackground("bg-primary")
                break;
        }

        setProjectTasks(teamMembersTasks.filter(t => t.projectId === projectId))

    }, [button, btnBackground, situation, btnHover, hover, priority, teamMembersTasks, projectId])


    const handleUpdate = async () => {
        try {
            await updateTaskSituation(id, situation)
            mutate(`/api/teams/${teamId}`)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async () => {
        if (!projectId) {
            try {
                await deleteTask(id)
                mutate(`/api/teams/${teamId}`)
            } catch (error) {
                console.log(error)
            }
        } else {
            const highestIndex = projectTasks.reduce((acc, task) => {
                const idx = task.index ?? 0
                const result = acc > idx
                return result ? acc : idx
            }, 0)
            const canDelete = projectTasks.filter(t => t.index === highestIndex).every(i => i.situation === "done")

            if (canDelete) {
                await deleteProject(projectId)
                toast({
                    description: "O projeto foi finalizado e todas as tarefas foram excluídas!"
                })
            } else {
                toast({
                    description: "Você precisa finalizar todas as tarefas do projeto para poder excluir as tarefas!"
                })
            }

        }

    }
    const { toast } = useToast()

    projectTasks.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))

    return (<li className={cn("flex justify-start items-center p-2 gap-2 rounded-md w-full transition-colors duration-300", hover)}><p className={cn("px-2 py-1 text-background rounded-sm", priorityBackground)}>{priority}</p>
        {situation === 'done' ?
            <form action={handleDelete}>
                <Button
                    className="w-[20px] md:w-[136px] text-primary"
                    type="submit"
                    variant="destructive"
                >
                    <Trash size={16} />
                    <p className="hidden md:block">Concluída</p>
                </Button>
            </form> :
            <form action={handleUpdate}>
                <Button
                    variant="outline"
                    className={cn("w-[20px] md:w-[136px] transition-colors duration-300", btnBackground, btnHover)}
                    type="submit"
                >
                    <ArrowRight size={16} />
                    <p className="hidden md:block">{button}</p>
                </Button>
            </form>}

        <Dialog>
            <DialogTrigger className="w-full text-left flex gap-4">
                <p>{description}</p>
                <p className="text-muted-foreground">{projectId ? <>{projectName}</> : "Tarefa simples"}</p>

            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    {projectId ? <>
                        <DialogTitle className="pb-2">{projectName}</DialogTitle>
                        <div className="max-h-[400px] overflow-y-auto flex flex-col justify-start gap-2">
                            {projectTasks.map(item => {
                                const currentUser = teamMembers.find(member => member.userId === item.userId)
                                return (
                                    <div key={item.id} className={cn("p-2 border rounded-sm flex flex-col", item.situation === "in_progress" ? "border-accent" : "border-muted", item.situation === "done" ? "opacity-50" : null)}>
                                        <p className="text-primary text-md font-bold">
                                            <span className="text-accent">{(item.index ?? 0) + 1}.</span> {item.description}</p>


                                        <p >Prioridade {item.priority}</p>
                                        <p className="text-muted-foreground text-sm italic">Atualizado {formatDistanceToNow(item.updatedAt, { addSuffix: true, locale: ptBR })}</p>
                                        <p className="text-muted-foreground text-sm italic">Criado {formatDistanceToNow(item.createdAt, { addSuffix: true, locale: ptBR })}</p>
                                        <div className="flex gap-1 justify-center sm:justify-start items-center">
                                            <Avatar className="w-5 h-5">
                                                <AvatarImage src={currentUser?.image} />
                                                <AvatarFallback> <User2 /> </AvatarFallback>
                                            </Avatar>
                                            <p className="font-bold">{currentUser?.name}</p></div>

                                    </div>)
                            })}
                        </div>
                    </> : <> <DialogTitle>Tarefa simples</DialogTitle>

                        <div className="p-2 border border-accent rounded-sm flex flex-col ">
                            <p className="text-primary text-md font-bold">{description}</p>
                            <p >Prioridade {priority}</p>
                            <p className="text-muted-foreground text-sm italic">Atualizado {dateUpdate}</p>
                            <p className="text-muted-foreground text-sm italic">Criado {dateCreate}</p>
                        </div>

                    </>}

                </DialogHeader>

                <DialogClose asChild>
                    <Button variant="outline">Concluir</Button>
                </DialogClose>
            </DialogContent>
        </Dialog>
    </li >)
}