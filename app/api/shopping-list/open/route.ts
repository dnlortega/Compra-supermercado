import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { getAccessibleUserIds } from "@/app/actions/sharing";

export async function GET() {
    try {
        const user = await requireUser();
        const accessibleIds = await getAccessibleUserIds();
        
        const list = await prisma.shoppingList.findFirst({
            where: {
                status: "OPEN",
                userId: { in: accessibleIds }
            },
            orderBy: { createdAt: "desc" },
        });

        if (!list) {
            return NextResponse.json({ error: "Nenhuma lista aberta encontrada" }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (error: any) {
        console.error("Error fetching open list:", error);
        return NextResponse.json({ error: "Falha ao buscar lista aberta" }, { status: 500 });
    }
}

