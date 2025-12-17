"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function finishShoppingList(name?: string) {
    // First, try to find an open list
    let list = await (prisma as any).shoppingList.findFirst({
        where: { status: "OPEN" },
        include: { products: true },
    });

    // If no open list exists, check if there are orphaned products
    if (!list) {
        const orphanedProducts = await prisma.product.findMany({
            where: { shoppingListId: null },
        });

        if (orphanedProducts.length === 0) {
            throw new Error("No products to finish");
        }

        // Create a new list and assign orphaned products to it
        list = await (prisma as any).shoppingList.create({
            data: {
                status: "OPEN",
                date: new Date(),
            },
            include: { products: true },
        });

        // Update orphaned products to belong to this list
        await prisma.product.updateMany({
            where: { shoppingListId: null },
            data: { shoppingListId: list.id },
        });

        // Reload list with products
        list = await (prisma as any).shoppingList.findUnique({
            where: { id: list.id },
            include: { products: true },
        });
    }

    if (!list || list.products.length === 0) {
        throw new Error("No products in the list");
    }

    const total = list.products.reduce((acc: number, p: { totalPrice: number | null }) => acc + (p.totalPrice || 0), 0);

    await (prisma as any).shoppingList.update({
        where: { id: list.id },
        data: {
            status: "COMPLETED",
            total,
            name: name || "Compra do Mês",
        }
    });

    revalidatePath("/history");
    revalidatePath("/summary");
    revalidatePath("/");
}
