"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function finishShoppingList(name?: string) {
    // 1. Find the current open list
    let list = await prisma.shoppingList.findFirst({
        where: { status: "OPEN" },
        include: { items: true },
    });

    if (!list || list.items.length === 0) {
        throw new Error("Não há itens na lista aberta para finalizar.");
    }

    const total = list.items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);

    // 2. Complete the list
    await prisma.shoppingList.update({
        where: { id: list.id },
        data: {
            status: "COMPLETED",
            total,
            name: name || "Compra do Mês",
        }
    });

    // 3. Create a new empty list
    await prisma.shoppingList.create({
        data: {
            status: "OPEN",
            date: new Date(),
        },
    });

    revalidatePaths();
}

function revalidatePaths() {
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/history");
    revalidatePath("/prices");
    revalidatePath("/summary");
}
