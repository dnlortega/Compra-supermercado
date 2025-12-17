"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCatalogProducts() {
    const products = await (prisma as any).catalogProduct.findMany({
        orderBy: { name: "asc" },
    });

    // Group by category
    return products.reduce((acc: Record<string, typeof products>, product: any) => {
        const category = product.category || "Outros";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {} as Record<string, typeof products>);
}

export async function getAllCatalogProducts() {
    return await (prisma as any).catalogProduct.findMany({
        orderBy: { name: "asc" },
    });
}

export async function addCatalogProduct(data: { name: string; category: string }) {
    await (prisma as any).catalogProduct.upsert({
        where: { name: data.name },
        update: { category: data.category },
        create: {
            name: data.name,
            category: data.category,
        },
    });
    revalidatePath("/catalog");
    revalidatePath("/list");
}

export async function deleteCatalogProduct(id: string) {
    await (prisma as any).catalogProduct.delete({
        where: { id },
    });
    revalidatePath("/catalog");
    revalidatePath("/list");
}

export async function seedCatalog() {
    const defaultCatalog = {
        "Essenciais": ["Arroz", "Feijão", "Óleo", "Macarrão", "Café", "Açúcar", "Sal", "Farinha"],
        "Hortifruti": ["Tomate", "Cebola", "Batata", "Banana", "Maçã", "Alface", "Alho"],
        "Frios & Laticínios": ["Leite", "Manteiga", "Queijo", "Presunto", "Iogurte", "Ovos"],
        "Limpeza": ["Detergente", "Sabão em Pó", "Água Sanitária", "Amaciante", "Esponja", "Desinfetante"],
        "Higiene": ["Papel Higiênico", "Sabonete", "Pasta de Dente", "Shampoo", "Condicionador"],
    };

    const count = await (prisma as any).catalogProduct.count();
    if (count > 0) return; // Already seeded

    for (const [category, items] of Object.entries(defaultCatalog)) {
        for (const name of items) {
            await (prisma as any).catalogProduct.create({
                data: { name, category },
            });
        }
    }
    revalidatePath("/catalog");
    revalidatePath("/list");
}
