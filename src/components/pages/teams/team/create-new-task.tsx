"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

import { Check, ListTodo } from "lucide-react"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { createTask } from "@/db/actions";
import { mutate } from "swr";

const newTaskSchema = z.object({
    description: z.string().min(2, "Dê mais detalhes sobre a tarefa!"),
    members: z.string().array().min(1, "Precisa selecionar ao menos um membro da equipe!")
})

type newTaskProps = z.infer<typeof newTaskSchema>

type TeamIdProps = {
    teamId: string
    teamMembers: TeamMember[]
}

type TeamMember = {
    userId: string
    name: string,
    role: string
}

export const CreateNewTask = ({ teamId, teamMembers }: TeamIdProps) => {

    teamMembers.sort((a, b) => a.role.localeCompare(b.role))

    const { register, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm<newTaskProps>({
        resolver: zodResolver(newTaskSchema),
        defaultValues: {
            description: "",
            members: []
        }
    })

    const onSubmit = async (data: newTaskProps) => {
        try {
            const task = await createTask(data.description, data.members, teamId)
            if (task) {
                reset()
            }
            toast({
                description: "Tarefa criada com sucesso!",
            })
            mutate(`/api/teams/${teamId}`)
        } catch (error) {
            console.error(error)
            toast({
                description: "Falha ao criar nova tarefa!",
            })
        }
    }

    const { toast } = useToast()

    return (
        <Dialog>
            <DialogTrigger asChild><Button onClick={() => {
                reset()
            }} variant="outline"><ListTodo size={16} /><p className="hidden md:block">Criar nova tarefa</p> </Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar nova tarefa</DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start justify-start gap-2 py-2">
                        <div className="flex items-center justify-center gap-2 w-full">
                            <Input placeholder="Digite a descrição da tarefa" {...register("description")} />
                            <Button
                                disabled={!(teamMembers.length > 0)}
                                type="submit"><Check size={16} /></Button>
                        </div>
                        {errors.description && <p className="text-destructive text-[.8rem]">{errors.description.message}</p>}

                        {teamMembers && teamMembers.length > 0 ? <ul className="flex flex-col gap-2 items-start justify-center w-full py-2">{teamMembers.map((item) => {
                            return (
                                <li className="flex items-center justify-start gap-2" key={item.userId}>
                                    <Checkbox
                                        onCheckedChange={(value) => {
                                            const values = getValues("members") ?? []
                                            setValue("members", value ? [...values, item.userId]
                                                : values.filter(id => id !== item.userId))
                                        }} id={item.userId} value={item.userId} />

                                    <Label htmlFor={item.userId}>{item.name}</Label></li>)
                        })}
                            {errors.members && <p className="text-destructive text-[.8rem]">{errors.members.message}</p>}
                        </ul>
                            : <p className="text-muted-foreground italic">Você ainda não possui membros no seu time.</p>}


                    </form>

                    <DialogClose asChild>
                        <Button variant="outline">Concluir</Button>
                    </DialogClose>

                </DialogHeader>
            </DialogContent>
        </Dialog>


    )
}