import { NextResponse } from "next/server";
import { getAllTeamsPageInfo, getUserId } from "@/db/queries";

export async function GET() {
    try {

        const userId = await getUserId()
        if (!userId) return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 })

        const teams = await getAllTeamsPageInfo(userId)

        return NextResponse.json(teams, { status: 200 })

    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Erro ao buscar times" }, { status: 500 })
    }
}
