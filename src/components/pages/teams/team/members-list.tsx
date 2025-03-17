"use client"
import { Accordion } from "@/components/ui/accordion"
import { MemberDetails } from "./member-details"


type MembersListProps = {
    members: MembersProps[],
    tasks: TasksProps[]
}

type MembersProps = {
    userId: string,
    name: string,
    role: string
    image: string
}

type TasksProps = {
    id: string,
    description: string,
    situation: string,
    createdAt: Date,
    updatedAt: Date,
    userId: string,
}

export const MembersList = ({ members, tasks }: MembersListProps) => {

    members.sort((a, b) => a.role.localeCompare(b.role))

    return (<main className="py-2 w-full">
        {
            members && members.length > 0 ? <Accordion className="w-full border border-muted bg-background rounded-md px-4 pb-4 " type="single" collapsible>
                {members.map(item => {
                    const thisMemberTasks = tasks.filter(task => task.userId === item.userId)
                    return (<MemberDetails
                        key={item.userId}
                        name={item.name}
                        role={item.role}

                        image={item.image}
                        tasks={thisMemberTasks}
                    />)
                })}
            </Accordion> : <div className="w-full border border-muted p-4 rounded-md"><p className="text-muted-foreground italic">Nenhum membro adicionado até o momento.</p></div>
        }



    </main>)
}