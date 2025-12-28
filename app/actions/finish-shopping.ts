"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";

export async function finishShoppingList(name?: string) {
    const user = await requireUser();

    // 1. Find the current open list for the user
    let list = await prisma.shoppingList.findFirst({
        where: {
            status: "OPEN",
            userId: user.id
        },
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

    // 3. Create a new empty list for the user
    await prisma.shoppingList.create({
        data: {
            status: "OPEN",
            date: new Date(),
            userId: user.id
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
