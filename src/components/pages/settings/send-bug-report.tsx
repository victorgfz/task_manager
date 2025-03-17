"use client"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useForm } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addNewReport } from "@/db/actions"

const bugReportSchema = z.object({
    text: z.string().min(3, "Precisa conter pelo menos 3 caracteres"),
    type: z.string({ required_error: "Precisa escolher alguma opção!" }).min(1, "Precisa escolher alguma opção!")
})

type bugReportProps = z.infer<typeof bugReportSchema>
const options = ["sugestion", "bug"] as const
type SendBugReportProps = {
    userId: string
}

export const SendBugReport = ({ userId }: SendBugReportProps) => {

    const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm<bugReportProps>({
        resolver: zodResolver(bugReportSchema)
    })

    const onSubmit = async (data: bugReportProps) => {
        try {
            await addNewReport(userId, data.type, data.text)
            toast({
                description: "Mensagem enviada com sucesso!"
            })
            reset()
        } catch (error) {
            console.error(error)
            toast({
                description: "Erro ao enviar a mensagem!"
            })
        }


    }

    const { toast } = useToast()

    return (<section className="py-4 mt-2 w-full">
        <h2 className="mb-4">Envie uma sugestão ou reporte algum problema.</h2>
        <form className="flex flex-col justify-center items-start gap-2 w-full max-w-[480px]" onSubmit={handleSubmit(onSubmit)}>
            <Select onValueChange={(value) => setValue("type", value)}>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => {
                        return (<SelectItem key={option} value={option}>{option === "bug" ? <>Reportar um problema</> : <>Sugestão de melhoria</>}</SelectItem>)

                    })}

                </SelectContent>
            </Select>
            {errors.type && <p className="mt-2 text-destructive text-[.8rem]">{errors.type.message}</p>}
            <Textarea {...register("text")} placeholder="Descreva o seu problema ou sugestão." />
            {errors.text && <p className="mt-2 text-destructive text-[.8rem]">{errors.text.message}</p>}
            <Button>Enviar</Button>
        </form>
    </section>
    )
}
