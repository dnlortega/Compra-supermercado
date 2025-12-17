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
