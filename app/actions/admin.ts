"use server"

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = "dnlortega@gmail.com";

async function requireAdmin() {
    const user = await requireUser();
    if (user.email !== ADMIN_EMAIL) {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function getAllUsersWithSharing() {
    await requireAdmin();

    const users = await prisma.user.findMany({
        orderBy: { name: 'asc' },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            sharedWith: {
                select: {
                    sharedTo: {
                        select: { id: true, name: true, email: true, image: true }
                    }
                }
            },
            sharedBy: {
                select: {
                    sharedBy: {
                        select: { id: true, name: true, email: true, image: true }
                    }
                }
            }
        }
    });

    return users;
}

export async function toggleSharing(ownerId: string, targetUserId: string, enable: boolean) {
    await requireAdmin();

    if (ownerId === targetUserId) {
        throw new Error("Cannot share with self");
    }

    try {
        if (enable) {
            // Create share if not exists
            const existing = await prisma.sharedAccess.findUnique({
                where: {
                    sharedById_sharedToId: {
                        sharedById: ownerId,
                        sharedToId: targetUserId
                    }
                }
            });

            if (!existing) {
                await prisma.sharedAccess.create({
                    data: {
                        sharedById: ownerId,
                        sharedToId: targetUserId
                    }
                });
            }
        } else {
            // Remove share
            await prisma.sharedAccess.delete({
                where: {
                    sharedById_sharedToId: {
                        sharedById: ownerId,
                        sharedToId: targetUserId
                    }
                }
            });
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error: any) {
        console.error("Error toggling sharing:", error);
        return { success: false, error: error.message };
    }
}

export async function getShoppingListsForUser(userId: string) {
    await requireAdmin();

    const lists = await prisma.shoppingList.findMany({
        where: { userId: userId },
        orderBy: { date: 'desc' },
        include: {
            _count: {
                select: { items: true }
            }
        }
    });

    return lists;
}
