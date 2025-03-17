"use client"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { removeTeamMember } from "@/db/actions"
import { useToast } from "@/hooks/use-toast"
import { Trash } from "lucide-react"
import { mutate } from "swr"


type MemberAddedProps = {
    userId: string,
    teamId: string,
    name: string,
    role: string,
}

export const MemberAdded = ({ userId, teamId, name, role }: MemberAddedProps) => {

    const handleRemove = async () => {
        try {
            await removeTeamMember(userId, teamId)
            mutate(`/api/teams/${teamId}`)
            toast({
                description: "Membro removido com sucesso!"
            })
        } catch (error) {
            console.error(error)
            toast({
                description: "Erro ao remover membro!"
            })
        }
    }

    const { toast } = useToast()
    return (<><Separator />
        <div className="flex gap-2 items-center justify-start w-full">
            <p className="font-bold">{name}</p>
            <p className="text-muted-foreground font-light flex-1">{role === "admin" ? <>Administrador</> : <>Membro</>}</p>
            <form action={handleRemove}>
                <Button type="submit" variant="destructive"><Trash size={16} /></Button>
            </form>

        </div>
    </>)
}