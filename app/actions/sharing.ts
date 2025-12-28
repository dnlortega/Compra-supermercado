"use server";

import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

/**
 * Shares current user's data with another user by email
 */
export async function shareDataAccess(targetEmail: string) {
    try {
        const user = await requireUser();
        
        // Validar formato de email básico
        if (!targetEmail || !targetEmail.includes("@")) {
            return { 
                success: false, 
                error: "Por favor, insira um e-mail válido" 
            };
        }

        const targetUser = await prisma.user.findUnique({
            where: { email: targetEmail.trim().toLowerCase() },
        });

        if (!targetUser) {
            return { 
                success: false, 
                error: "Usuário não encontrado. O e-mail precisa estar cadastrado no sistema." 
            };
        }

        if (targetUser.id === user.id) {
            return { 
                success: false, 
                error: "Você não pode compartilhar dados com você mesmo" 
            };
        }

        await prisma.sharedAccess.upsert({
            where: {
                sharedById_sharedToId: {
                    sharedById: user.id,
                    sharedToId: targetUser.id,
                },
            },
            update: {},
            create: {
                sharedById: user.id,
                sharedToId: targetUser.id,
            },
        });

        revalidatePath("/settings");
        await clearAccessibleIdsCache(); // Limpar cache quando há mudanças
        return { success: true };
    } catch (error: any) {
        console.error("Error sharing data:", error);
        // Retornar erro ao invés de lançar para evitar problemas no render
        return { 
            success: false, 
            error: error.message || "Falha ao compartilhar dados. Verifique se o banco está sincronizado." 
        };
    }
}

/**
 * Removes shared access to another user
 */
export async function revokeSharedAccess(targetUserId: string) {
    try {
        const user = await requireUser();

        await prisma.sharedAccess.delete({
            where: {
                sharedById_sharedToId: {
                    sharedById: user.id,
                    sharedToId: targetUserId,
                },
            },
        });

        revalidatePath("/settings");
        await clearAccessibleIdsCache(); // Limpar cache quando há mudanças
        return { success: true };
    } catch (error: any) {
        console.error("Error revoking access:", error);
        // Retornar erro ao invés de lançar para evitar problemas no render
        return { 
            success: false, 
            error: error.message || "Falha ao remover acesso." 
        };
    }
}

/**
 * Gets who I am sharing my data WITH
 */
export async function getPeopleIHaveSharedWith() {
    try {
        const user = await requireUser();
        return await prisma.sharedAccess.findMany({
            where: { sharedById: user.id },
            include: {
                sharedTo: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching shares with me:", error);
        return [];
    }
}

/**
 * Gets who is sharing their data WITH ME
 */
export async function getPeopleSharingWithMe() {
    try {
        const user = await requireUser();
        return await prisma.sharedAccess.findMany({
            where: { sharedToId: user.id },
            include: {
                sharedBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });
    } catch (error) {
        console.error("Error fetching shares sharing with me:", error);
        return [];
    }
}

// Cache para accessible user IDs (cache por 1 minuto)
const accessibleIdsCache = new Map<string, { data: string[], timestamp: number }>();
const ACCESSIBLE_IDS_CACHE_TTL = 60 * 1000; // 1 minuto

/**
 * Helper to get all user IDs that the current user has access to
 * (My own ID + IDs of everyone sharing with me)
 */
export async function getAccessibleUserIds() {
    try {
        const user = await requireUser();
        const cacheKey = `accessibleIds_${user.id}`;
        const cached = accessibleIdsCache.get(cacheKey);
        
        // Verificar cache
        if (cached && Date.now() - cached.timestamp < ACCESSIBLE_IDS_CACHE_TTL) {
            return cached.data;
        }

        // Defensive check: handle cases where DB tables are not yet created
        const sharingWithMe = await prisma.sharedAccess.findMany({
            where: { sharedToId: user.id },
            select: { sharedById: true },
        });

        const result = [user.id, ...sharingWithMe.map(s => s.sharedById)];
        
        // Salvar no cache
        accessibleIdsCache.set(cacheKey, { data: result, timestamp: Date.now() });
        
        return result;
    } catch (error) {
        console.error("Shared access data not available yet:", error);
        // Fallback: return just the current user if tables missing
        try {
            const user = await requireUser();
            return [user.id];
        } catch {
            return [];
        }
    }
}

/**
 * Limpar cache de accessible user IDs (chamado quando há mudanças no compartilhamento)
 */
export async function clearAccessibleIdsCache() {
    accessibleIdsCache.clear();
}
