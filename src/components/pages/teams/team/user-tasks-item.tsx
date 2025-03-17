"use client"
import { Button } from "@/components/ui/button"
import { deleteTask, updateTaskSituation } from "@/db/actions"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale"
import { ArrowRight, Trash } from "lucide-react"
import { mutate } from "swr"

type UserTasksItemProps = {
    teamId: string,
    id: string,
    description: string,
    situation: string
    createdAt: Date,
    updatedAt: Date
}

export const UserTasksItem = ({ teamId, id, description, situation, updatedAt, createdAt }: UserTasksItemProps) => {



    const [button, setButton] = useState("Iniciar")
    const [btnBackground, setBtnBackground] = useState("bg-green-600/70")
    const [btnHover, setBtnHover] = useState("hover:bg-green-600")
    const [hover, setHover] = useState("hover:bg-green-600/10")



    const dateCreate = formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })
    const dateUpdate = formatDistanceToNow(updatedAt, { addSuffix: true, locale: ptBR })

    const handleUpdate = async () => {
        try {
            await updateTaskSituation(id, situation)
            mutate(`/api/teams/${teamId}`)
        } catch (error) {
            console.error(error)
        }
    }

    const handleDelete = async () => {
        try {
            await deleteTask(id)
        } catch (error) {
            console.log(error)
        }
    }


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
    }, [button, btnBackground, situation, btnHover, hover])


    return (<li className={cn("flex justify-start items-center p-2 gap-2 rounded-md w-full transition-colors duration-300", hover)}>
        {situation === 'done' ?
            <form action={handleDelete}>
                <Button
                    className="w-[20px] md:w-[136px]"
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
        <p className={cn("flex-1", situation === "done" ? "text-muted-foreground" : "text-primary")}>{description}</p>
        <div className="flex flex-col md:flex-row justify-between items-end md:gap-2 md:flex-1"><p className="text-muted-foreground text-sm">Atualizado {dateUpdate}</p><p className="text-muted-foreground text-sm">Criado {dateCreate}</p></div>




    </li>)
}