"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { getAccessibleUserIds } from "./sharing";

export async function finishShoppingList(name?: string) {
    const user = await requireUser();
    const accessibleIds = await getAccessibleUserIds();

    // 1. Find the current open list among accessible user IDs
    let list = await prisma.shoppingList.findFirst({
        where: {
            status: "OPEN",
            userId: { in: accessibleIds }
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
