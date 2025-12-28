"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";
import { getAccessibleUserIds } from "./sharing";

export async function getOpenList() {
    const user = await requireUser();
    const accessibleIds = await getAccessibleUserIds();
    return await prisma.shoppingList.findFirst({
        where: {
            status: "OPEN",
            userId: { in: accessibleIds }
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
    const accessibleIds = await getAccessibleUserIds();

    // Verify ownership or shared access
    const list = await prisma.shoppingList.findUnique({ where: { id } });
    if (!list || !accessibleIds.includes(list.userId as string)) throw new Error("Unauthorized");

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
    const accessibleIds = await getAccessibleUserIds();

    const where: any = { userId: { in: accessibleIds } };
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
    const accessibleIds = await getAccessibleUserIds();
    const list = await prisma.shoppingList.findUnique({
        where: { id },
        include: {
            items: {
                include: { catalogProduct: true }
            }
        }
    });

    if (!list || !accessibleIds.includes(list.userId as string)) throw new Error("Unauthorized");
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
    const accessibleIds = await getAccessibleUserIds();

    const list = await prisma.shoppingList.findUnique({ where: { id } });
    if (!list || !accessibleIds.includes(list.userId as string)) throw new Error("Unauthorized");

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
    const accessibleIds = await getAccessibleUserIds();

    const list = await prisma.shoppingList.findUnique({ where: { id } });
    if (!list || !accessibleIds.includes(list.userId as string)) throw new Error("Unauthorized");

    const res = await prisma.shoppingList.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    return res;
}
