import { auth } from "@/lib/auth";
import { cache } from "react";
import { db } from "./index";
import { tasks, teamUsers, teams, users } from "./schema"
import { eq, and, count } from "drizzle-orm";


export const getUserId = cache(async () => {
    const session = await auth()
    const userId = session?.user?.id;
    if (!userId) throw new Error("Usuário não encontrado!")

    return userId
})


export const getAllTeamsPageInfo = cache(async (userId: string) => {
    const teamsData = await db
        .select({
            id: teams.id,
            title: teams.title,
            type: teams.typeTeam,
            role: teamUsers.role,
        })
        .from(teams)
        .innerJoin(teamUsers, eq(teams.id, teamUsers.teamId))
        .where(eq(teamUsers.userId, userId))

    const membersCounts = await db
        .select({
            teamId: teamUsers.teamId,
            membersCount: count(),
        })
        .from(teamUsers)
        .groupBy(teamUsers.teamId);

    return teamsData.map(team => ({
        ...team,
        membersCount:
            membersCounts.find(m => m.teamId === team.id)?.membersCount || 0,
    }))
})

export const getAllTeamPageInfo = cache(async (userId: string, teamId: string) => {

    const team = await db.select({
        id: teams.id,
        title: teams.title,
        type: teams.typeTeam
    }).from(teams).limit(1).where(eq(teams.id, teamId))


    const userIsMember: boolean = !!(await db.query.teamUsers.findFirst({
        where: and(eq(teamUsers.teamId, teamId), eq(teamUsers.userId, userId))
    }))

    const teamMembers = await db.select({
        userId: teamUsers.userId,
        role: teamUsers.role,
        name: users.name,
        image: users.image,
    }).from(teamUsers)
        .innerJoin(users, eq(users.id, teamUsers.userId))
        .where(eq(teamUsers.teamId, teamId))

    const teamMembersTasks = await db.select({
        id: tasks.id,
        userId: tasks.userId,
        description: tasks.description,
        situation: tasks.situation,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
    }).from(tasks).where(eq(tasks.teamId, teamId))



    return { userIsMember, team, teamMembers, teamMembersTasks, userId }
})
