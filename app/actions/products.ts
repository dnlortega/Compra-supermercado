"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper to get or create the current open shopping list
async function getCurrentListId() {
    const list = await (prisma as any).shoppingList.findFirst({
        where: { status: "OPEN" },
    });

    if (list) return list.id;

    const newList = await (prisma as any).shoppingList.create({
        data: {
            status: "OPEN",
            date: new Date(),
        },
    });
    return newList.id;
}

// Migrate orphaned products to a new list
async function migrateOrphanedProducts() {
    const orphanedProducts = await prisma.product.findMany({
        where: { shoppingListId: null },
    });

    if (orphanedProducts.length > 0) {
        const listId = await getCurrentListId();

        await prisma.product.updateMany({
            where: { shoppingListId: null },
            data: { shoppingListId: listId },
        });
    }
}

export async function getProducts() {
    // First, migrate any orphaned products
    await migrateOrphanedProducts();

    // Try to find an open list
    const list = await (prisma as any).shoppingList.findFirst({
        where: { status: "OPEN" },
        include: {
            products: {
                orderBy: { createdAt: "desc" }
            }
        },
    });

    if (list) {
        return list.products;
    }

    // If no list exists, return empty array
    return [];
}


function determineCategory(name: string): string {
    const lower = name.toLowerCase();

    const categories: Record<string, string[]> = {
        "Comida": [
            "feijão", "feijao", "arroz", "açúcar", "acucar", "óleo", "oleo",
            "macarrão", "macarrao", "nescau", "chocolate", "molho", "alho",
            "ovo", "carne", "frango", "peixe", "leite", "pão", "pao", "café", "cafe"
        ],
        "Hortifruti": [
            "fruta", "legume", "banana", "maçã", "maca", "batata", "cebola",
            "tomate", "alface", "cenoura"
        ],
        "Higiene Pessoal": [
            "papel higiênico", "papel higienico", "sabonete", "creme dental", "pasta de dente",
            "shampoo", "xampu", "condicionador", "desodorante", "escova", "fio dental"
        ],
        "Limpeza": [
            "sabão", "sabao", "amaciante", "desinfetante", "pano", "detergente",
            "vash", "água sanitária", "agua sanitaria", "esponja", "limpa vidro"
        ]
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(k => lower.includes(k))) {
            return category;
        }
    }

    return "Outros";
}

export async function addProduct(data: { name: string; quantity: number }) {
    const listId = await getCurrentListId();
    const category = determineCategory(data.name);

    await prisma.product.create({
        data: {
            name: data.name,
            quantity: data.quantity,
            shoppingListId: listId,
            category,
        },
    });

    revalidatePaths();
}

export async function updateProduct(id: string, data: Partial<{ name: string; quantity: number; unitPrice: number; checked: boolean }>) {
    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) throw new Error("Product not found");

    const quantity = data.quantity ?? current.quantity;
    const unitPrice = data.unitPrice !== undefined ? data.unitPrice : current.unitPrice;

    let totalPrice = current.totalPrice;
    if (unitPrice !== null && unitPrice !== undefined) {
        totalPrice = quantity * unitPrice;
    }

    await prisma.product.update({
        where: { id },
        data: {
            ...data,
            totalPrice,
        },
    });
    revalidatePaths();
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });
    revalidatePaths();
}

function revalidatePaths() {
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
}
