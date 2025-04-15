"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

import { Plus, ScrollText, X } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { mutate } from "swr";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createProject } from "@/db/actions";
import { useToast } from "@/hooks/use-toast";



type TeamIdProps = {
    teamId: string
    teamMembers: TeamMember[]
}

type TeamMember = {
    userId: string
    name: string,
    role: string
}

const newProjectSchema = z.object({
    title: z.string().min(2, "O nome do projeto precisa ser maior!"),
    tasks: z.array(
        z.object({
            description: z.string().min(2, "Dê mais detalhes sobre a tarefa!"),
            members: z.string().array().min(1, "Precisa selecionar ao menos um membro da equipe!"),
            priority: z.number().min(1).max(3),
            index: z.number()
        })
    ).min(1, "Precisa adicionar pelo menos uma tarefa!"),
})

type newProjectProps = z.infer<typeof newProjectSchema>

export const CreateNewProject = ({ teamId, teamMembers }: TeamIdProps) => {
    teamMembers.sort((a, b) => a.role.localeCompare(b.role))

    const { control, register, handleSubmit, formState: { errors }, setValue, getValues, reset, watch } = useForm<newProjectProps>({
        resolver: zodResolver(newProjectSchema),
        defaultValues: {
            title: "",
            tasks: [{ description: "", members: [], priority: 2, index: 0 }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tasks",
    });

    const onSubmit = async (data: newProjectProps) => {
        try {
            await createProject(data.title, teamId, data.tasks)
            reset()
            toast({
                description: "Projeto criado com sucesso!",
            })
            mutate(`/api/teams/${teamId}`)
        } catch (error) {
            console.error(error)
            toast({
                description: "Falha ao criar novo projeto!",
            })
        }
    }

    const { toast } = useToast()

    return (
        <Dialog>
            <DialogTrigger asChild><Button onClick={() => {
                reset()
            }} variant="outline"><ScrollText size={16} /><p className="hidden md:block">Criar novo projeto</p> </Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar novo projeto</DialogTitle>


                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start justify-start gap-2 py-2 ">
                        <div className="max-h-[500px] overflow-y-auto w-full flex flex-col items-start justify-start gap-2">
                            <Input placeholder="Digite o nome do projeto" {...register("title")} />
                            {errors.title && <p className="text-destructive text-[.8rem]">{errors.title.message}</p>}

                            {fields.map((field, index) => (

                                <div className="w-full flex flex-col items-start justify-start gap-2 p-4 border border-muted rounded-sm" key={field.id}>
                                    <h2 className="text-accent text-md">Tarefa {index + 1}</h2>
                                    <div className="flex items-center justify-center gap-2 w-full">
                                        <Input type="hidden" value={index} {...register(`tasks.${index}.index`)} />
                                        <Input placeholder="Digite a descrição da tarefa" {...register(`tasks.${index}.description`)} />
                                    </div>
                                    {errors.tasks?.[index]?.description && <p className="text-destructive text-[.8rem]">{errors.tasks?.[index].description.message}</p>}
                                    <div className="w-full">
                                        <p className="font-bold">Prioridade: {watch(`tasks.${index}.priority`)}</p>
                                        <Controller
                                            name={`tasks.${index}.priority`}
                                            control={control}
                                            render={({ field }) => (
                                                <Slider
                                                    value={[field.value]}
                                                    onValueChange={(value) => field.onChange(value[0])}
                                                    min={1}
                                                    max={3}
                                                    step={1} />)}
                                        /></div>
                                    {teamMembers && teamMembers.length > 0 ? <ul className="flex flex-col gap-2 items-start justify-center w-full py-2">{teamMembers.map((item) => {
                                        return (
                                            <li className="flex items-center justify-start gap-2" key={item.userId}>
                                                <Checkbox
                                                    onCheckedChange={(value) => {
                                                        const values = getValues(`tasks.${index}.members`) ?? []
                                                        setValue(`tasks.${index}.members`, value ? [...values, item.userId]
                                                            : values.filter(id => id !== item.userId))
                                                    }} id={`${item.userId}-${index}`} value={item.userId} />

                                                <Label htmlFor={`${item.userId}-${index}`}>{item.name}</Label></li>)
                                    })}
                                        {errors.tasks?.[index]?.members && <p className="text-destructive text-[.8rem]">{errors.tasks?.[index].members.message}</p>}
                                    </ul>
                                        : <p className="text-muted-foreground italic">Você ainda não possui membros no seu time.</p>}

                                    <Button className="w-full text-red-500 hover:text-red-700" type="button" variant="outline" onClick={() => remove(index)}><X />Remover tarefa</Button>
                                </div>

                            ))}
                            {errors.tasks && <p className="text-destructive text-[.8rem]">{errors.tasks.message}</p>}
                            <Button variant="outline" type="button" onClick={() => append({ description: "", members: [], priority: 2, index: fields.length })} className="w-full mt-2">
                                <Plus />  Adicionar Tarefa
                            </Button>
                        </div>


                        <Button className="w-full" type="submit">Criar novo projeto</Button>
                    </form>



                </DialogHeader>
            </DialogContent>
        </Dialog>


    )
}