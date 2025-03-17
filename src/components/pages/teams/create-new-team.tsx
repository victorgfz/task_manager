"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,

} from "@/components/ui/dialog"

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { createTeam } from "@/db/actions";
import { useRouter } from "next/navigation"
import { mutate } from "swr";

const teamSchema = z.object({
    title: z.string().min(2, "Precisa conter pelo menos 2 caracteres!"),
    type: z.string().min(2, "Precisa conter pelo menos 2 caracteres!")
})

type TeamProps = z.infer<typeof teamSchema>

export const CreateNewTeam = () => {
    const router = useRouter()
    const { handleSubmit, register, formState: { errors }, setValue } = useForm<TeamProps>({
        resolver: zodResolver(teamSchema)

    })

    const onSubmit = async (data: TeamProps) => {
        try {
            const team = await createTeam(data.title, data.type)

            toast({
                description: "Seu novo time foi criado com sucesso!",
            })
            mutate(`/api/teams`)
            router.push(`/dashboard/teams/${team.id}`)

        } catch (error) {
            console.error(error)
            toast({
                description: "Falha ao criar o novo time!",
            })
        }

    }

    const { toast } = useToast()

    return (
        <Dialog>
            <DialogTrigger asChild><Button onClick={() => {
                setValue("title", "")
                setValue("type", "")
            }} variant="outline"><Plus size={16} />Criar novo time</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar novo time</DialogTitle>

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-start justify-center gap-2 ">
                        <div className="flex gap-2 justify-center items-start w-full">
                            <div className="w-full">
                                <Label htmlFor="title">Título</Label>
                                <Input id="title" placeholder="Dê um título ao seu time" {...register('title')} />
                                {errors.title && <p className="text-destructive text-[.8rem]">{errors.title.message}</p>}
                            </div>
                            <div className="w-full">
                                <Label htmlFor="type">
                                    Tipo
                                </Label>
                                <Input id="type" placeholder="Que tipo de time é esse?" {...register('type')} />
                                {errors.type && <p className="text-destructive text-[.8rem]">{errors.type.message}</p>}
                            </div>
                        </div>
                        <Button
                            type="submit"
                            variant="outline"
                            className="w-full"
                        >Criar Time</Button>
                    </form>


                </DialogHeader>
            </DialogContent>
        </Dialog >
    )

}