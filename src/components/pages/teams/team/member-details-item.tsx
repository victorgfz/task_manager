"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowRight, Trash } from "lucide-react";

type MemberDetailsItemProps = {

    situation: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export const MemberDetailsItem = ({ situation, description, createdAt, updatedAt }: MemberDetailsItemProps) => {


    const [message, setMessage] = useState("Disponível")
    const [background, setBackground] = useState("bg-green-600/70")
    const [hover, setHover] = useState("hover:bg-green-600/10")


    const dateCreate = formatDistanceToNow(createdAt, { addSuffix: true, locale: ptBR })
    const dateUpdate = formatDistanceToNow(updatedAt, { addSuffix: true, locale: ptBR })


    useEffect(() => {
        switch (situation) {
            case "in_progress":
                setBackground("bg-yellow-600/70")
                setHover("hover:bg-yellow-600/10")
                setMessage("Em processo")
                break;
            case "done":
                setBackground("bg-red-600/70")
                setHover("hover:bg-yellow-600/10")
                setMessage("Concluída")
                break;
        }
    }, [background, message, situation])

    return (<div className={cn("flex justify-start items-center p-2 gap-2 rounded-md w-full transition-colors hover:duration-300", hover)}>
        <span className={cn("rounded-sm w-[28px] md:w-[124px] flex justify-center items-center gap-2 py-2 text-primary", background)}>
            {situation === "done" ? <Trash size={16} /> : <ArrowRight size={16} />}
            <p className="hidden md:block">{message}</p>

        </span>
        <p className={cn("flex-1", situation === "done" ? "text-muted-foreground" : "text-primary")}>{description}</p>

        <div className="flex flex-col md:flex-row justify-between items-end md:gap-2 md:flex-1">
            <p className="text-muted-foreground text-sm">Atualizado {dateUpdate}</p>
            <p className="text-muted-foreground text-sm">Criado {dateCreate}</p>
        </div>


    </div>)
}