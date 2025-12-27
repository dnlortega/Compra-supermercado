"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function exportAllHistory() {
    try {
        const lists = await prisma.shoppingList.findMany({
            include: {
                items: {
                    include: { catalogProduct: true }
                },
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
        const list = await prisma.shoppingList.findUnique({
            where: { id },
            include: {
                items: {
                    include: { catalogProduct: true }
                },
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
            const products = listData.products || (listData.items?.map((item: any) => ({ ...item, ...item.catalogProduct })));
            if (!products) continue;

            const { id: _id, createdAt: _c, updatedAt: _u, items: _i, products: _p, ...listInfo } = listData;

            // 1. Create List
            const newList = await prisma.shoppingList.create({
                data: {
                    ...listInfo,
                    date: new Date(listInfo.date),
                    total: parseFloat(listInfo.total) || 0,
                    status: listInfo.status || "COMPLETED"
                },
            });

            // 2. Create items with catalog linkage
            for (const p of products) {
                const catName = p.category || "Outros";

                // Ensure Category
                const category = await prisma.category.upsert({
                    where: { name: catName },
                    update: {},
                    create: { name: catName }
                });

                // Ensure CatalogProduct
                const catalogProduct = await prisma.catalogProduct.upsert({
                    where: { name: p.name },
                    update: { categoryId: category.id },
                    create: { name: p.name, categoryId: category.id }
                });

                // Create Item
                await prisma.shoppingListItem.create({
                    data: {
                        quantity: parseFloat(p.quantity) || 1,
                        unitPrice: p.unitPrice ? parseFloat(p.unitPrice) : null,
                        totalPrice: p.totalPrice ? parseFloat(p.totalPrice) : null,
                        unit: p.unit || "UN",
                        checked: p.checked || false,
                        shoppingListId: newList.id,
                        catalogProductId: catalogProduct.id
                    }
                });
            }

            importedCount++;
        }

        revalidatePath("/");
        revalidatePath("/list");
        revalidatePath("/history");
        return { success: true, count: importedCount };
    } catch (error) {
        console.error("Import error:", error);
        return { success: false, error: "Falha ao importar dados. Verifique o formato do arquivo." };
    }
}
