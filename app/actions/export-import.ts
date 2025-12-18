"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function exportAllHistory() {
    try {
        const lists = await (prisma as any).shoppingList.findMany({
            include: {
                products: true,
            },
            orderBy: {
                date: "desc",
            },
        });
        return { success: true, data: lists };
    } catch (error) {
        console.error("Export error:", error);
        return { success: false, error: "Falha ao exportar dados" };
    }
}

export async function exportSingleList(id: string) {
    try {
        const list = await (prisma as any).shoppingList.findUnique({
            where: { id },
            include: {
                products: true,
            },
        });

        if (!list) {
            return { success: false, error: "Lista não encontrada" };
        }

        return { success: true, data: list };
    } catch (error) {
        console.error("Export error:", error);
        return { success: false, error: "Falha ao exportar lista" };
    }
}

export async function importData(jsonData: string) {
    try {
        const parsed = JSON.parse(jsonData);
        const lists = Array.isArray(parsed) ? parsed : [parsed];

        let importedCount = 0;

        for (const listData of lists) {
            // Check if it's a valid list object
            if (!listData.products) continue;

            const { products, id: _id, createdAt: _c, updatedAt: _u, ...listInfo } = listData;

            // Create new list
            const newList = await (prisma as any).shoppingList.create({
                data: {
                    ...listInfo,
                    date: new Date(listInfo.date),
                    total: parseFloat(listInfo.total) || 0,
                    products: {
                        create: products.map((p: any) => {
                            const { id: _pid, shoppingListId: _slid, createdAt: _pc, updatedAt: _pu, ...productInfo } = p;
                            return {
                                ...productInfo,
                                unitPrice: productInfo.unitPrice ? parseFloat(productInfo.unitPrice) : null,
                                totalPrice: productInfo.totalPrice ? parseFloat(productInfo.totalPrice) : null,
                                quantity: parseInt(productInfo.quantity) || 1
                            };
                        }),
                    },
                },
            });

            importedCount++;
        }

        revalidatePath("/history");
        return { success: true, count: importedCount };
    } catch (error) {
        console.error("Import error:", error);
        return { success: false, error: "Falha ao importar dados. Verifique o formato do arquivo." };
    }
}
