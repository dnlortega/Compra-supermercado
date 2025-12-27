"use server";

import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function getHistory() {
    try {
        const lists = await prisma.shoppingList.findMany({
            where: {
                status: "COMPLETED",
            },
            orderBy: {
                date: "desc",
            },
            include: {
                items: true,
            },
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
                total: list.total || list.items.reduce((acc: number, item: any) => acc + (item.totalPrice || 0), 0),
                itemCount: list.items.length,
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
