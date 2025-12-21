"use server";

import { prisma } from "@/lib/db";
// no cache revalidation — always rely on DB

export async function getOpenList() {
    return await (prisma as any).shoppingList.findFirst({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        include: { products: true },
    });
}

export async function updateShoppingListDate(id: string, dateStr: string) {
    // Normalize to noon UTC to avoid timezone shifts
    const date = new Date(`${dateStr}T12:00:00Z`);
    await (prisma as any).shoppingList.update({
        where: { id },
        data: { date },
    });
    // removed cache revalidation; pages will read from DB directly
}

export async function listShoppingLists(filter?: { status?: string; take?: number }) {
    const where: any = {};
    if (filter?.status) where.status = filter.status;

    const lists = await (prisma as any).shoppingList.findMany({
        where: Object.keys(where).length ? where : undefined,
        include: { products: true },
        orderBy: { date: 'desc' },
        take: filter?.take || 200,
    });

    return lists;
}

export async function getShoppingListById(id: string) {
    return await (prisma as any).shoppingList.findUnique({ where: { id }, include: { products: true } });
}

export async function createShoppingList(data: { name?: string; date?: Date; status?: string }) {
    return await (prisma as any).shoppingList.create({ data });
}

export async function updateShoppingList(id: string, data: { name?: string; date?: Date; status?: string }) {
    return await (prisma as any).shoppingList.update({ where: { id }, data });
}

export async function deleteShoppingList(id: string) {
    // cascade should remove related products (prisma schema uses onDelete Cascade)
    return await (prisma as any).shoppingList.delete({ where: { id } });
}
