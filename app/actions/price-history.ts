"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { getAccessibleUserIds } from "./sharing";

async function getOrCreateCatalogProduct(name: string, userId: string) {
    return await prisma.catalogProduct.upsert({
        where: { name },
        update: {},
        create: {
            name,
            userId
        }
    });
}

export async function savePriceHistory(productName: string, unitPrice: number) {
    const user = await requireUser();
    const cp = await getOrCreateCatalogProduct(productName, user.id);
    await prisma.priceHistory.create({
        data: {
            catalogProductId: cp.id,
            unitPrice,
            purchaseDate: new Date(),
            userId: user.id
        },
    });
    revalidatePath("/prices");
}

export async function getPriceHistory(productName: string) {
    const user = await requireUser();
    const cp = await prisma.catalogProduct.findUnique({
        where: { name: productName }
    });
    if (!cp) return [];

    const accessibleIds = await getAccessibleUserIds();
    const history = await prisma.priceHistory.findMany({
        where: {
            catalogProductId: cp.id,
            userId: { in: accessibleIds }
        },
        orderBy: { purchaseDate: 'desc' },
        take: 10,
    });

    return history;
}

export async function getLastPrice(productName: string) {
    const user = await requireUser();
    const cp = await prisma.catalogProduct.findFirst({
        where: {
            name: { equals: productName, mode: 'insensitive' }
        }
    });

    if (!cp) return null;

    const accessibleIds = await getAccessibleUserIds();
    const lastEntry = await prisma.priceHistory.findFirst({
        where: {
            catalogProductId: cp.id,
            userId: { in: accessibleIds }
        },
        orderBy: { purchaseDate: 'desc' },
    });

    return lastEntry?.unitPrice || null;
}

export async function listPriceHistory(filter?: { productName?: string; take?: number }) {
    const user = await requireUser();
    const accessibleIds = await getAccessibleUserIds();

    const where: any = { userId: { in: accessibleIds } };
    if (filter?.productName) {
        where.catalogProduct = {
            name: { contains: filter.productName, mode: 'insensitive' }
        };
    }

    const history = await prisma.priceHistory.findMany({
        where,
        include: { catalogProduct: true },
        orderBy: { purchaseDate: 'desc' },
        take: filter?.take || 200,
    });

    return history;
}

export async function deletePriceHistoryEntry(id: string) {
    const user = await requireUser();
    const accessibleIds = await getAccessibleUserIds();

    const entry = await prisma.priceHistory.findUnique({ where: { id } });
    if (!entry || !accessibleIds.includes(entry.userId as string)) throw new Error("Unauthorized");

    const res = await prisma.priceHistory.delete({ where: { id } });
    revalidatePath("/prices");
    return res;
}

export async function deleteZeroValueHistoryEntries() {
    const user = await requireUser();

    // Only allow admin (or logic could be user-specific) - for now assuming user is authorized if they can access this action
    // But since this deletes potentially shared data or lots of data, let's stick to the current user's accessible scope or just user's own data?
    // User requested "admin" functionality. And implementation uses accessibleIds usually.
    // Let's delete entries where unitPrice is 0 or null within accessible scope.
    const accessibleIds = await getAccessibleUserIds();

    const result = await prisma.priceHistory.deleteMany({
        where: {
            userId: { in: accessibleIds },
            OR: [
                { unitPrice: 0 },
                { unitPrice: null }
            ]
        }
    });

    revalidatePath("/prices");
    return { count: result.count };
}

export async function createPriceHistoryEntry(productName: string, unitPrice: number, purchaseDate?: Date) {
    const user = await requireUser();
    const cp = await getOrCreateCatalogProduct(productName, user.id);
    const res = await prisma.priceHistory.create({
        data: {
            catalogProductId: cp.id,
            unitPrice,
            purchaseDate: purchaseDate ?? new Date(),
            userId: user.id
        },
    });
    revalidatePath("/prices");
    return res;
}

export async function copyProductToPriceHistory(productId: string) {
    const user = await requireUser();
    const item = await prisma.shoppingListItem.findUnique({
        where: { id: productId },
        include: {
            shoppingList: true,
            catalogProduct: true
        }
    });

    if (!item || item.shoppingList.userId !== user.id) throw new Error('Unauthorized');
    if (item.unitPrice === null || item.unitPrice === undefined) throw new Error('Item has no unitPrice');

    const purchaseDate = item.shoppingList?.date ?? new Date();

    const res = await prisma.priceHistory.create({
        data: {
            catalogProductId: item.catalogProductId!,
            unitPrice: item.unitPrice,
            purchaseDate,
            userId: user.id
        },
    });
    revalidatePath("/prices");
    return res;
}
export async function updatePriceHistoryEntry(id: string, data: { productName?: string; unitPrice?: number; purchaseDate?: Date }) {
    const user = await requireUser();
    const accessibleIds = await getAccessibleUserIds();

    const entry = await prisma.priceHistory.findUnique({ where: { id } });
    if (!entry || !accessibleIds.includes(entry.userId as string)) throw new Error("Unauthorized");

    const { productName, ...rest } = data;
    let catalogProductId: string | undefined;

    if (productName) {
        const cp = await getOrCreateCatalogProduct(productName, user.id);
        catalogProductId = cp.id;
    }

    const res = await prisma.priceHistory.update({
        where: { id },
        data: {
            ...rest,
            ...(catalogProductId ? { catalogProductId } : {})
        }
    });
    revalidatePath("/prices");
    return res;
}

export async function cleanupPriceHistoryForPurchase(productName: string, purchaseDate: Date) {
    const user = await requireUser();
    const cp = await prisma.catalogProduct.findFirst({
        where: { name: productName }
    });
    if (!cp) return;

    const startOfDay = new Date(purchaseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(purchaseDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.priceHistory.deleteMany({
        where: {
            userId: user.id,
            catalogProductId: cp.id,
            purchaseDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });
    revalidatePath("/prices");
}

export async function importOpenListToPriceHistory(shoppingListId?: string) {
    const user = await requireUser();

    let listId = shoppingListId;
    if (!listId) {
        const open = await prisma.shoppingList.findFirst({
            where: {
                status: 'OPEN',
                userId: user.id
            }
        });
        if (!open) return { created: 0 };
        listId = open.id;
    } else {
        // Verify ownership if ID is provided
        const list = await prisma.shoppingList.findUnique({ where: { id: listId } });
        if (!list || list.userId !== user.id) throw new Error("Unauthorized");
    }

    const items = await prisma.shoppingListItem.findMany({
        where: {
            shoppingListId: listId,
            unitPrice: { not: null }
        }
    });

    const createdEntries = [];
    for (const item of items) {
        try {
            const entry = await prisma.priceHistory.create({
                data: {
                    catalogProductId: item.catalogProductId,
                    unitPrice: item.unitPrice || 0,
                    purchaseDate: new Date(),
                    userId: user.id
                }
            });
            createdEntries.push(entry);
        } catch (err) {
            console.error('Failed to create price history for', item.id, err);
        }
    }

    revalidatePath("/prices");
    return { created: createdEntries.length, entries: createdEntries };
}
