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
import { useEffect, useState } from "react";

type MemberDetailsProps = {
    userId: string,
    image: string,
    name: string,
    role: string,
    tasks: TasksProps[],
    teamMembers: TeamMember[],
    teamMembersTasks: TasksProps[],
    teamProjects: TeamProject[]
}

type TasksProps = {
    id: string,
    description: string,
    priority: number,
    situation: string,
    createdAt: Date,
    updatedAt: Date,
    userId: string,
    projectId: string | null;
    index: number | null;
}

type TeamMember = {
    userId: string
    name: string,
    role: string,
    image: string
}

type TeamProject = {
    id: string
    title: string,
}


export const MemberDetails = ({ name, role, image, tasks, teamMembersTasks, teamMembers, teamProjects }: MemberDetailsProps) => {
    const tasksOrder: { [key: string]: number } = { "in_progress": 1, "not_started": 2, "done": 3 }
    const tasksOrdered = tasks.sort((a, b) => tasksOrder[a.situation] - tasksOrder[b.situation])
    tasksOrdered.sort((a, b) => b.priority - a.priority)

    const [newTasksOrdered, setNewTasksOrdered] = useState(tasks)

    useEffect(() => {
        const filtered = tasksOrdered.filter(task => {


            if (!task.projectId) return true

            const projectTasks = teamMembersTasks
                .filter(t => t.projectId === task.projectId)

            const groupedByIndex = projectTasks.reduce((acc, t) => {
                const idx = t.index ?? 0
                acc[idx] = acc[idx] || []
                acc[idx].push(t)
                return acc
            }, {} as Record<number, TasksProps[]>)

            const currentIndex = task.index ?? 0
            if (currentIndex === 0) return true

            const previousTasks = groupedByIndex[currentIndex - 1]
            const allPreviousDone = previousTasks?.every(t => t.situation === "done")

            return allPreviousDone
        })

        setNewTasksOrdered(filtered)
    }, [tasksOrdered, teamMembersTasks])

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
                {newTasksOrdered && newTasksOrdered.length > 0 ? newTasksOrdered.map((item) => {
                    const projectName = teamProjects.find(p => p.id === item.projectId)?.title ?? ""
                    return (<MemberDetailsItem description={item.description} situation={item.situation} createdAt={item.createdAt} updatedAt={item.updatedAt} key={item.id} priority={item.priority} projectId={item.projectId} index={item.index}
                        teamMembersTasks={teamMembersTasks} teamMembers={teamMembers} projectName={projectName}
                    />)
                }) : <p className="text-muted-foreground italic">Nenhuma tarefa recebida/adiciona até o momento.</p>}
            </AccordionContent>
        </AccordionItem>

    )
}