"use server";

import { prisma } from "@/lib/db";

export async function savePriceHistory(productName: string, unitPrice: number) {
    await (prisma as any).priceHistory.create({
        data: {
            productName,
            unitPrice,
            purchaseDate: new Date(),
        },
    });
}

export async function getPriceHistory(productName: string) {
    const history = await (prisma as any).priceHistory.findMany({
        where: {
            productName: {
                equals: productName,
                mode: 'insensitive',
            },
        },
        orderBy: {
            purchaseDate: 'desc',
        },
        take: 10,
    });

    return history;
}

export async function getLastPrice(productName: string) {
    const lastEntry = await (prisma as any).priceHistory.findFirst({
        where: {
            productName: {
                equals: productName,
                mode: 'insensitive',
            },
        },
        orderBy: {
            purchaseDate: 'desc',
        },
    });

    return lastEntry?.unitPrice || null;
}

export async function cleanupPriceHistoryForPurchase(productName: string, purchaseDate: Date) {
    // Remove price history entries that match the purchase date
    // This helps clean up when products are removed from purchase history
    const startOfDay = new Date(purchaseDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(purchaseDate);
    endOfDay.setHours(23, 59, 59, 999);

    await (prisma as any).priceHistory.deleteMany({
        where: {
            productName: {
                equals: productName,
                mode: 'insensitive',
            },
            purchaseDate: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });
}

export async function listPriceHistory(filter?: { productName?: string; take?: number }) {
    const where: any = {};
    if (filter?.productName) {
        where.productName = { contains: filter.productName, mode: 'insensitive' };
    }

    const history = await (prisma as any).priceHistory.findMany({
        where: Object.keys(where).length ? where : undefined,
        orderBy: { purchaseDate: 'desc' },
        take: filter?.take || 200,
    });

    return history;
}

export async function deletePriceHistoryEntry(id: string) {
    return await (prisma as any).priceHistory.delete({ where: { id } });
}

export async function updatePriceHistoryEntry(id: string, data: { productName?: string; unitPrice?: number; purchaseDate?: Date }) {
    return await (prisma as any).priceHistory.update({ where: { id }, data });
}

export async function createPriceHistoryEntry(productName: string, unitPrice: number, purchaseDate?: Date) {
    return await (prisma as any).priceHistory.create({
        data: {
            productName,
            unitPrice,
            purchaseDate: purchaseDate ?? new Date(),
        },
    });
}

export async function copyProductToPriceHistory(productId: string) {
    const product = await (prisma as any).product.findUnique({ where: { id: productId }, include: { shoppingList: true } });
    if (!product) throw new Error('Product not found');
    if (product.unitPrice === null || product.unitPrice === undefined) throw new Error('Product has no unitPrice');

    const purchaseDate = product.shoppingList?.date ?? new Date();

    return await (prisma as any).priceHistory.create({
        data: {
            productName: product.name,
            unitPrice: product.unitPrice,
            purchaseDate,
        },
    });
}

export async function importOpenListToPriceHistory(shoppingListId?: string) {
    // If no list id provided, find the open list
    let listId = shoppingListId;
    if (!listId) {
        const open = await (prisma as any).shoppingList.findFirst({ where: { status: 'OPEN' } });
        if (!open) return { created: 0 };
        listId = open.id;
    }

    const products = await (prisma as any).product.findMany({ where: { shoppingListId: listId, unitPrice: { not: null } } });
    let created = 0;
    for (const p of products) {
        try {
            await (prisma as any).priceHistory.create({ data: { productName: p.name, unitPrice: p.unitPrice || 0, purchaseDate: new Date() } });
            created += 1;
        } catch (err) {
            // ignore individual failures
            console.error('Failed to create price history for', p.name, err);
        }
    }

    return { created };
}