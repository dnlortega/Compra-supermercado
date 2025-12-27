"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function getOrCreateCatalogProduct(name: string) {
    return await prisma.catalogProduct.upsert({
        where: { name },
        update: {},
        create: { name }
    });
}

export async function savePriceHistory(productName: string, unitPrice: number) {
    const cp = await getOrCreateCatalogProduct(productName);
    await prisma.priceHistory.create({
        data: {
            catalogProductId: cp.id,
            unitPrice,
            purchaseDate: new Date(),
        },
    });
    revalidatePath("/prices");
}

export async function getPriceHistory(productName: string) {
    const cp = await prisma.catalogProduct.findUnique({ where: { name: productName } });
    if (!cp) return [];

    const history = await prisma.priceHistory.findMany({
        where: { catalogProductId: cp.id },
        orderBy: { purchaseDate: 'desc' },
        take: 10,
    });

    return history;
}

export async function getLastPrice(productName: string) {
    const cp = await prisma.catalogProduct.findFirst({
        where: { name: { equals: productName, mode: 'insensitive' } }
    });

    if (!cp) return null;

    const lastEntry = await prisma.priceHistory.findFirst({
        where: { catalogProductId: cp.id },
        orderBy: { purchaseDate: 'desc' },
    });

    return lastEntry?.unitPrice || null;
}

export async function cleanupPriceHistoryForPurchase(productName: string, purchaseDate: Date) {
    const cp = await prisma.catalogProduct.findUnique({ where: { name: productName } });
    if (!cp) return;

    const startOfDay = new Date(purchaseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(purchaseDate);
    endOfDay.setHours(23, 59, 59, 999);

    await prisma.priceHistory.deleteMany({
        where: {
            catalogProductId: cp.id,
            purchaseDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });
    revalidatePath("/prices");
}

export async function listPriceHistory(filter?: { productName?: string; take?: number }) {
    const where: any = {};
    if (filter?.productName) {
        where.catalogProduct = {
            name: { contains: filter.productName, mode: 'insensitive' }
        };
    }

    const history = await prisma.priceHistory.findMany({
        where: Object.keys(where).length ? where : undefined,
        include: { catalogProduct: true },
        orderBy: { purchaseDate: 'desc' },
        take: filter?.take || 200,
    });

    return history;
}

export async function deletePriceHistoryEntry(id: string) {
    const res = await prisma.priceHistory.delete({ where: { id } });
    revalidatePath("/prices");
    return res;
}

export async function updatePriceHistoryEntry(id: string, data: { productName?: string; unitPrice?: number; purchaseDate?: Date }) {
    const { productName, ...rest } = data;
    let catalogProductId: string | undefined;

    if (productName) {
        const cp = await getOrCreateCatalogProduct(productName);
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

export async function createPriceHistoryEntry(productName: string, unitPrice: number, purchaseDate?: Date) {
    const cp = await getOrCreateCatalogProduct(productName);
    const res = await prisma.priceHistory.create({
        data: {
            catalogProductId: cp.id,
            unitPrice,
            purchaseDate: purchaseDate ?? new Date(),
        },
    });
    revalidatePath("/prices");
    return res;
}

export async function copyProductToPriceHistory(productId: string) {
    const item = await prisma.shoppingListItem.findUnique({
        where: { id: productId },
        include: {
            shoppingList: true,
            catalogProduct: true
        }
    });

    if (!item) throw new Error('Item not found');
    if (item.unitPrice === null || item.unitPrice === undefined) throw new Error('Item has no unitPrice');

    const purchaseDate = item.shoppingList?.date ?? new Date();

    const res = await prisma.priceHistory.create({
        data: {
            catalogProductId: item.catalogProductId!,
            unitPrice: item.unitPrice,
            purchaseDate,
        },
    });
    revalidatePath("/prices");
    return res;
}

export async function importOpenListToPriceHistory(shoppingListId?: string) {
    let listId = shoppingListId;
    if (!listId) {
        const open = await prisma.shoppingList.findFirst({ where: { status: 'OPEN' } });
        if (!open) return { created: 0 };
        listId = open.id;
    }

    const items = await prisma.shoppingListItem.findMany({
        where: { shoppingListId: listId, unitPrice: { not: null } }
    });

    const createdEntries: any[] = [];
    for (const item of items) {
        try {
            const entry = await prisma.priceHistory.create({
                data: {
                    catalogProductId: item.catalogProductId!,
                    unitPrice: item.unitPrice || 0,
                    purchaseDate: new Date()
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
