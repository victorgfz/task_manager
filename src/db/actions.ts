"use server"

import { auth } from "@/lib/auth";
import { db } from "./index";
import { projects, reports, tasks, teams, teamUsers, users } from "./schema";
import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";


const getUserIdOrError = async () => {
    const session = await auth();
    const userId = session?.user?.id
    if (!userId) throw new Error("Usuário não encontrado!")
    return userId
}

export const createTeam = async (title: string, typeTeam: string) => {

    const userId = await getUserIdOrError()

    const newTeam = await db.insert(teams).values({ title, typeTeam }).returning()
    await db.insert(teamUsers).values({ teamId: newTeam[0].id, userId, role: "admin" })

    revalidatePath("/dashboard/teams");

    return newTeam[0]
}

export const deleteTeam = async (teamId: string) => {
    await db.delete(teams).where(eq(teams.id, teamId))
    revalidatePath("/dashboard/teams");
}

export const createTask = async (description: string, members: string[], priority: number, teamId: string, projectId: string | null, index: number | null) => {
    const task = await Promise.all(members.map(async (item) => {
        return await db.insert(tasks).values({ description, userId: item, priority, teamId, projectId, index }).returning()
    }))
    revalidatePath("/dashboard/teams/[id]", "page")
    return task[0]
}

export const updateTaskSituation = async (id: string, situation: string) => {
    let newSituation;
    switch (situation) {
        case "not_started":
            newSituation = "in_progress";
            break
        case "in_progress":
            newSituation = "done";
            break

    }
    const update = new Date()
    await db.update(tasks).set({ situation: newSituation, updatedAt: update }).where(eq(tasks.id, id))

    revalidatePath("/dashboard/teams/[id]", "page");
}

export const deleteTask = async (id: string) => {
    await db.delete(tasks).where(eq(tasks.id, id))
    revalidatePath("/dashboard/teams/[id]", "page");
}

export const createProject = async (title: string, teamId: string, tasks: { description: string, members: string[], priority: number, index: number }[]) => {

    const project = await db.insert(projects).values({ title, teamId }).returning()
    const tasksCreated = await Promise.all(tasks.map(async (item) => {
        await createTask(item.description, item.members, item.priority, teamId, project[0].id, item.index)
    }))
    revalidatePath("/dashboard/teams/[id]", "page");
    return tasksCreated[0]
}

export const deleteProject = async (projectId: string) => {
    await db.delete(projects).where(eq(projects.id, projectId))
    await db.delete(tasks).where(eq(tasks.projectId, projectId))
    revalidatePath("/dashboard/teams/[id]", "page");
}

export const addNewMember = async (email: string, role: string, teamId: string) => {
    const member = await db.query.users.findFirst({
        where: eq(users.email, email)
    })
    if (!member) throw new Error("Email não encontrado!")
    const newMember = await db.insert(teamUsers).values({ teamId, userId: member.id, role }).returning()
    revalidatePath("/dashboard/teams/[id]", "page");
    return newMember[0]
}

export const removeTeamMember = async (userId: string, teamId: string) => {
    await db.delete(teamUsers).where(and(eq(teamUsers.teamId, teamId), eq(teamUsers.userId, userId)))
    revalidatePath("/dashboard/teams/[id]", "page");
}

export const addNewReport = async (userId: string, type: string, text: string) => {
    await db.insert(reports).values({ text, type, userId })
}
