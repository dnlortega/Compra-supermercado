"use server";

import { prisma } from "@/lib/db";
// no cache revalidation — always rely on DB

export async function getOpenList() {
    return await (prisma as any).shoppingList.findFirst({
        where: { status: "OPEN" },
        include: { products: true },
    });
}

export async function updateShoppingListDate(id: string, dateStr: string) {
    // Normalize to noon UTC to avoid timezone shifts
    const date = new Date(`${dateStr}T12:00:00Z`);
    await (prisma as any).shoppingList.update({
        where: { id },
        data: { date },
    });
    // removed cache revalidation; pages will read from DB directly
}
