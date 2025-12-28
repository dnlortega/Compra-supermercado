"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";

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

    const history = await prisma.priceHistory.findMany({
        where: {
            catalogProductId: cp.id,
            userId: user.id
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

    const lastEntry = await prisma.priceHistory.findFirst({
        where: {
            catalogProductId: cp.id,
            userId: user.id
        },
        orderBy: { purchaseDate: 'desc' },
    });

    return lastEntry?.unitPrice || null;
}

export async function listPriceHistory(filter?: { productName?: string; take?: number }) {
    const user = await requireUser();

    const where: any = { userId: user.id };
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

    const entry = await prisma.priceHistory.findUnique({ where: { id } });
    if (!entry || entry.userId !== user.id) throw new Error("Unauthorized");

    const res = await prisma.priceHistory.delete({ where: { id } });
    revalidatePath("/prices");
    return res;
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
