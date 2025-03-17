"use client"

import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { MemberDetailsItem } from "./member-details-item";
import { User2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type MemberDetailsProps = {
    image: string,
    name: string,
    role: string,
    tasks: TasksProps[]
}

type TasksProps = {
    id: string,
    description: string,
    situation: string,
    createdAt: Date,
    updatedAt: Date,
    userId: string,
}


export const MemberDetails = ({ name, role, image, tasks }: MemberDetailsProps) => {
    const tasksOrder: { [key: string]: number } = { "in_progress": 1, "not_started": 2, "done": 3 }
    tasks.sort((a, b) => tasksOrder[a.situation] - tasksOrder[b.situation])
    return (
        <AccordionItem value={name}>
            <AccordionTrigger className="flex justify-start items-center gap-4">
                <Avatar className="w-7 h-7">
                    <AvatarImage src={image} />
                    <AvatarFallback> <User2 /> </AvatarFallback>
                </Avatar>
                <p className="font-bold">{name}</p>
                <Separator orientation="vertical" />
                <p className="text-muted-foreground">{role === "admin" ? <>Administrador</> : <>Membro</>}</p>

            </AccordionTrigger>
            <AccordionContent className="w-full flex flex-col gap-2 items-start justify-center">
                {tasks && tasks.length > 0 ? tasks.map((item) => {
                    return (<MemberDetailsItem description={item.description} situation={item.situation} createdAt={item.createdAt} updatedAt={item.updatedAt} key={item.id} />)
                }) : <p className="text-muted-foreground italic">Nenhuma tarefa recebida/adiciona até o momento.</p>}
            </AccordionContent>
        </AccordionItem>

    )
}