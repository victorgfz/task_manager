import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { User2 } from "lucide-react"
import { Session } from "next-auth"


type UserInfoProps = {
    user: Session["user"] | null
}

export const UserInfoIcon = ({ user }: UserInfoProps) => {
    return (<div className="flex justify-start gap-2 py-4 border-b border-muted flex-shrink-0 h-[60px]">
        <Avatar className="w-7 h-7 overflow-hidden">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback> <User2 /> </AvatarFallback>
        </Avatar>
    </div>)
}

export const UserInfo = ({ user }: UserInfoProps) => {

    return (<div className="flex justify-start gap-2 py-4 border-b border-muted flex-shrink-0 h-[60px]">
        <Avatar className="w-7 h-7">
            <AvatarImage src={user?.image ?? ""} />
            <AvatarFallback> <User2 /> </AvatarFallback>
        </Avatar>
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col justify-start items-start flex-shrink-0 h-[60px]"
        >
            <p className="text-left font-bold text-[1rem] leading-none">{user?.name}</p>
            <span className="text-muted-foreground text-[.8rem] italic ">{user?.email}</span>
        </motion.div>

    </div>)
}