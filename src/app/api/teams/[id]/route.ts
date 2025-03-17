import { type NextRequest, NextResponse } from "next/server";
import { getAllTeamPageInfo, getUserId } from "@/db/queries";

type Params = Promise<{ id: string }>

export async function GET(req: NextRequest, { params }: { params: Params }) {
    try {

        const teamId = (await params).id
        const userId = await getUserId()

        if (!userId) return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })

        const teamInfo = await getAllTeamPageInfo(userId, teamId)

        return NextResponse.json(teamInfo, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erro ao buscar informações do time" }, { status: 500 })
    }
}
