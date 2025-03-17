"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Plus, Users } from "lucide-react"

import { useToast } from "@/hooks/use-toast"
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { MemberAdded } from "./member-added";
import { addNewMember } from "@/db/actions";
import { mutate } from "swr";


const newMemberSchema = z.object({
    email: z.string().min(3, "Precisa conter pelo menos 3 caracteres").email("Email inválido!"),
    role: z.string({ required_error: "Precisa escolher uma posição!" }).min(1, "Precisa escolher uma posição!")
})

type newMemberProps = z.infer<typeof newMemberSchema>

type TeamIdProps = {
    teamId: string,
    teamMembers: TeamMember[],
}

type TeamMember = {
    userId: string,
    name: string,
    role: string
}

const roles = ["admin", "member"] as const

export const ManageTeamMembers = ({ teamId, teamMembers }: TeamIdProps) => {

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<newMemberProps>({
        resolver: zodResolver(newMemberSchema),
        defaultValues: {
            email: "",
        }
    })

    const onSubmit = async (data: newMemberProps) => {
        try {
            const newMember = await addNewMember(data.email, data.role, teamId)
            mutate(`/api/teams/${teamId}`)
            if (newMember) { reset() }
            toast({
                description: "Membro adicionado com sucesso!"
            })
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    description: error.message
                })
            }
        }
    }

    teamMembers.sort((a, b) => a.role.localeCompare(b.role))

    const { toast } = useToast()

    return (
        <Dialog>
            <DialogTrigger asChild><Button onClick={() => {
                reset()
            }} variant="outline"><Users size={16} /> <p className="hidden md:block">Gerenciar equipe</p></Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Adicionar novos membros</DialogTitle>
                    <form onSubmit={handleSubmit(onSubmit)} className="flex items-start justify-center gap-2 py-2">
                        <div>
                            <Input placeholder="Digite o email do usuário" {...register("email")} />
                            {errors.email && <p className="mt-2 text-destructive text-[.8rem]">{errors.email.message}</p>}
                        </div>
                        <div>
                            <Select
                                onValueChange={(value) => setValue("role", value)}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="Posição" />
                                </SelectTrigger>
                                <SelectContent>
                                    {roles.map(pos => {
                                        return (<SelectItem key={pos} value={pos}>{pos === "admin" ? <>Administrador</> : <>Membro</>}</SelectItem>)
                                    })}
                                </SelectContent>
                            </Select>
                            {errors.role && <p className="mt-2 text-destructive text-[.8rem]">{errors.role.message}</p>}
                        </div>
                        <Button
                            type="submit"><Plus size={16} /></Button>
                    </form>
                    {teamMembers && teamMembers.length > 0 ? <section className="py-2 flex flex-col gap-2 justify-center items-start">
                        <DialogTitle className="mb-2">Remover membros</DialogTitle>
                        {teamMembers.map(item => {
                            return <MemberAdded teamId={teamId} userId={item.userId} key={item.userId} name={item.name} role={item.role} />
                        })}
                    </section> : <p className="text-muted-foreground italic">Você ainda não possui membros no seu time.</p>}
                    <DialogClose asChild>
                        <Button variant="outline">Concluir</Button>
                    </DialogClose>


                </DialogHeader>
            </DialogContent>
        </Dialog>


    )
}