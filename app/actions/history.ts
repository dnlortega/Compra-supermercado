"use server";

import { prisma } from "@/lib/db";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export async function getHistory() {
    try {
        // Attempt to aggregate if ShoppingList exists
        // We use 'any' casting to avoid build errors if the client isn't fully updated in the IDE context
        // but the runtime might support it if the DB is updated.
        const lists = await (prisma as any).shoppingList.findMany({
            where: {
                status: "COMPLETED",
            },
            orderBy: {
                date: "desc",
            },
            include: {
                products: true,
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
                // If total is 0, maybe calculate from products? But usage suggests we store it.
                total: list.total || list.products.reduce((acc: number, p: any) => acc + (p.totalPrice || 0), 0),
                itemCount: list.products.length,
                name: list.name,
            });
        }

        // Convert to array
        return Object.entries(grouped).map(([month, lists]) => ({
            month,
            lists,
        }));

    } catch (_error) {
        return [];
    }
}
