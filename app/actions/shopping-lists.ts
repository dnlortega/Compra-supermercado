"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";

export async function getOpenList() {
    const user = await requireUser();
    return await prisma.shoppingList.findFirst({
        where: {
            status: "OPEN",
            userId: user.id
        },
        orderBy: { createdAt: "desc" },
        include: {
            items: {
                include: { catalogProduct: true }
            }
        },
    });
}

export async function updateShoppingListDate(id: string, dateStr: string) {
    const user = await requireUser();

    // Verify ownership
    const list = await prisma.shoppingList.findUnique({ where: { id } });
    if (!list || list.userId !== user.id) throw new Error("Unauthorized");

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
    const user = await requireUser();

    const where: any = { userId: user.id };
    if (filter?.status) where.status = filter.status;

    const lists = await prisma.shoppingList.findMany({
        where,
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
    const user = await requireUser();
    const list = await prisma.shoppingList.findUnique({
        where: { id },
        include: {
            items: {
                include: { catalogProduct: true }
            }
        }
    });

    if (!list || list.userId !== user.id) throw new Error("Unauthorized");
    return list;
}

export async function createShoppingList(data: { name?: string; date?: Date; status?: string }) {
    const user = await requireUser();
    const res = await prisma.shoppingList.create({
        data: {
            ...data,
            userId: user.id
        }
    });
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    return res;
}

export async function updateShoppingList(id: string, data: { name?: string; date?: Date; status?: string }) {
    const user = await requireUser();

    const list = await prisma.shoppingList.findUnique({ where: { id } });
    if (!list || list.userId !== user.id) throw new Error("Unauthorized");

    const res = await prisma.shoppingList.update({
        where: { id },
        data
    });
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    return res;
}

export async function deleteShoppingList(id: string) {
    const user = await requireUser();

    const list = await prisma.shoppingList.findUnique({ where: { id } });
    if (!list || list.userId !== user.id) throw new Error("Unauthorized");

    const res = await prisma.shoppingList.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    return res;
}
