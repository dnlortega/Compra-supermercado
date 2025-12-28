"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";

export async function exportAllHistory() {
    try {
        const user = await requireUser();
        const lists = await prisma.shoppingList.findMany({
            where: {
                userId: user.id
            },
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
        const user = await requireUser();
        const list = await prisma.shoppingList.findUnique({
            where: { id },
            include: {
                items: {
                    include: { catalogProduct: true }
                },
            },
        });

        if (!list || list.userId !== user.id) {
            return { success: false, error: "Lista não encontrada ou sem permissão" };
        }

        return { success: true, data: list };
    } catch (error) {
        console.error("Export error:", error);
        return { success: false, error: "Falha ao exportar lista" };
    }
}

export async function importData(jsonData: string) {
    try {
        const user = await requireUser();
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
                    status: listInfo.status || "COMPLETED",
                    userId: user.id
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
                    create: {
                        name: p.name,
                        categoryId: category.id,
                        userId: user.id
                    }
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
