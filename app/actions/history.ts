"use server";

import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { requireUser } from "@/lib/session";
import { getAccessibleUserIds } from "./sharing";

export async function getHistory() {
    try {
        const user = await requireUser();
        const accessibleIds = await getAccessibleUserIds();

        const lists = await prisma.shoppingList.findMany({
            where: {
                status: "COMPLETED",
                userId: { in: accessibleIds }
            },
            orderBy: {
                date: "desc",
            },
            select: {
                id: true,
                date: true,
                total: true,
                name: true,
                _count: {
                    select: { items: true }
                }
            }
        });

        const grouped: Record<string, any[]> = {};

        for (const list of lists) {
            const date = new Date(list.date);
            const monthKey = format(date, "MMMM yyyy", { locale: ptBR });

            if (!grouped[monthKey]) {
                grouped[monthKey] = [];
            }

            grouped[monthKey].push({
                id: list.id,
                date: list.date,
                total: list.total || 0,
                itemCount: list._count.items,
                name: list.name,
            });
        }

        return Object.entries(grouped).map(([month, lists]) => ({
            month,
            lists,
        }));

    } catch (_error) {
        console.error("Error in getHistory:", _error);
        return [];
    }
}
