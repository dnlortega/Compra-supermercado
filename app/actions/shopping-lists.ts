"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getOpenList() {
    return await prisma.shoppingList.findFirst({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: { catalogProduct: true }
            }
        },
    });
}

export async function updateShoppingListDate(id: string, dateStr: string) {
    // Normalize to noon UTC to avoid timezone shifts
    const date = new Date(`${dateStr}T12:00:00Z`);
    await prisma.shoppingList.update({
        where: { id },
        data: { date },
    });
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/");
}

export async function listShoppingLists(filter?: { status?: string; take?: number }) {
    const where: any = {};
    if (filter?.status) where.status = filter.status;

    const lists = await prisma.shoppingList.findMany({
        where: Object.keys(where).length ? where : undefined,
        include: {
            items: {
                include: { catalogProduct: true }
            }
        },
        orderBy: { date: 'desc' },
        take: filter?.take || 200,
    });

    return lists;
}

export async function getShoppingListById(id: string) {
    return await prisma.shoppingList.findUnique({
        where: { id },
        include: {
            items: {
                include: { catalogProduct: true }
            }
        }
    });
}

export async function createShoppingList(data: { name?: string; date?: Date; status?: string }) {
    const res = await prisma.shoppingList.create({ data });
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    return res;
}

export async function updateShoppingList(id: string, data: { name?: string; date?: Date; status?: string }) {
    const res = await prisma.shoppingList.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    return res;
}

export async function deleteShoppingList(id: string) {
    // cascade should remove related products (prisma schema uses onDelete Cascade)
    const res = await prisma.shoppingList.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    return res;
}
