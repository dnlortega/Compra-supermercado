"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session";

export async function getCatalogProducts() {
    const user = await requireUser();

    const products = await prisma.catalogProduct.findMany({
        where: {
            OR: [
                { userId: user.id },
                { userId: null } // Global defaults
            ]
        },
        include: { category: true },
        orderBy: { name: "asc" },
    });

    // Group by category name
    return products.reduce((acc: Record<string, typeof products>, product: any) => {
        const categoryName = product.category?.name || "Outros";
        if (!acc[categoryName]) acc[categoryName] = [];
        acc[categoryName].push(product);
        return acc;
    }, {} as Record<string, typeof products>);
}

export async function getAllCatalogProducts() {
    const user = await requireUser();

    return await prisma.catalogProduct.findMany({
        where: {
            OR: [
                { userId: user.id },
                { userId: null }
            ]
        },
        include: { category: true },
        orderBy: { name: "asc" },
    });
}

export async function createCatalogProduct(name: string, categoryName?: string) {
    try {
        const user = await requireUser();
        let categoryId: string | undefined;

        if (categoryName) {
            const category = await prisma.category.upsert({
                where: { name: categoryName },
                update: {},
                create: { name: categoryName }
            });
            categoryId = category.id;
        }

        await prisma.catalogProduct.upsert({
            where: { name },
            update: { categoryId },
            create: {
                name,
                categoryId,
                userId: user.id
            },
        });

        revalidatePath("/list");
        return { success: true };
    } catch (error) {
        console.error("Error creating catalog product:", error);
        return { success: false, error: "Falha ao cadastrar produto" };
    }
}

export async function seedCatalog() {
    const defaultCatalog: Record<string, string[]> = {
        "Essenciais": ["Arroz", "Feijão", "Óleo", "Macarrão", "Café", "Açúcar", "Sal", "Farinha", "Biscoito", "Molho de Tomate", "Extrato de Tomate", "Milho", "Ervilha", "Maionese", "Ketchup", "Mostarda", "Vinagre", "Azeite", "Pipoca", "Gelatina", "Creme de Leite", "Leite Condensado", "Achocolatado", "Chá"],
        "Bebidas": ["Água Mineral", "Suco", "Refrigerante", "Cerveja", "Vinho", "Energético", "Água de Coco", "Chá Gelado"],
        "Hortifruti": ["Tomate", "Cebola", "Batata", "Banana", "Maçã", "Alface", "Alho", "Cenoura", "Abóbora", "Chuchu", "Batata Doce", "Limão", "Laranja", "Pêra", "Melancia", "Mamão", "Abacaxi", "Couve", "Brócolis", "Pimentão", "Abobrinha"],
        "Carnes & Aves": ["Carne Moída", "Filé de Frango", "Alcatra", "Contra Filé", "Costela", "Coxa de Frango", "Sobrecoxa", "Salsicha", "Linguiça", "Peixe", "Bacon", "Patinho", "Coxão Mole", "Maminha"],
        "Frios & Laticínios": ["Leite", "Manteiga", "Queijo Mussarela", "Presunto", "Iogurte", "Ovos", "Requeijão", "Margarina", "Queijo Prato", "Mortadela", "Salame", "Peito de Peru"],
        "Padaria": ["Pão Francês", "Pão de Forma", "Bisnaga", "Bolo", "Pão de Queijo", "Torrada"],
        "Limpeza": ["Detergente", "Sabão em Pó", "Lava Roupa", "Lava Roupas Líquido", "Sabão Líquido", "Água Sanitária", "Amaciante", "Esponja", "Desinfetante", "Desengordurante", "Limpa Vidros", "Saco de Lixo", "Papel Toalha", "Vassoura", "Rodo", "Pano de Prato"],
        "Higiene": ["Papel Higiênico", "Sabonete", "Pasta de Dente", "Shampoo", "Condicionador", "Fio Dental", "Enxaguante Bucal", "Desodorante", "Absorvente", "Algodão"],
        "Pet Shop": ["Ração para Cães", "Ração para Gatos", "Areia Sanitária", "Petisco"]
    };

    for (const [categoryName, items] of Object.entries(defaultCatalog)) {
        const category = await prisma.category.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName }
        });

        for (const name of items) {
            await prisma.catalogProduct.upsert({
                where: { name },
                update: { categoryId: category.id },
                create: { name, categoryId: category.id },
            });
        }
    }
    revalidatePath("/list");
}
