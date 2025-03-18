import { NextResponse } from "next/server";
import { getAllTeamPageInfo, getUserId } from "@/db/queries";



export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {

        const { id } = await params
        console.log(id)
        const userId = await getUserId()

        if (!userId) return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })

        const teamInfo = await getAllTeamPageInfo(userId, id)

        return NextResponse.json(teamInfo, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erro ao buscar informações do time" }, { status: 500 })
    }
}
