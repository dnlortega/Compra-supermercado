"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getOpenList() {
    return await (prisma as any).shoppingList.findFirst({
        where: { status: "OPEN" },
        include: { products: true },
    });
}

export async function updateShoppingListDate(id: string, date: Date) {
    await (prisma as any).shoppingList.update({
        where: { id },
        data: { date },
    });
    revalidatePath("/prices");
}
