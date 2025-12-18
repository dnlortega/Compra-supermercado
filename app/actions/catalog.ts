"use server";

import { prisma } from "@/lib/db";
// no cache revalidation — always rely on DB

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

export async function seedCatalog() {
    const defaultCatalog: Record<string, string[]> = {
        "Essenciais": [
            "Arroz", "Feijão", "Óleo", "Macarrão", "Café", "Açúcar", "Sal", "Farinha",
            "Biscoito", "Molho de Tomate", "Extrato de Tomate", "Milho", "Ervilha",
            "Maionese", "Ketchup", "Mostarda", "Vinagre", "Azeite", "Pipoca",
            "Gelatina", "Creme de Leite", "Leite Condensado", "Achocolatado", "Chá"
        ],
        "Bebidas": [
            "Água Mineral", "Suco", "Refrigerante", "Cerveja", "Vinho", "Energético",
            "Água de Coco", "Chá Gelado"
        ],
        "Hortifruti": [
            "Tomate", "Cebola", "Batata", "Banana", "Maçã", "Alface", "Alho",
            "Cenoura", "Abóbora", "Chuchu", "Batata Doce", "Limão", "Laranja", "Pêra",
            "Melancia", "Mamão", "Abacaxi", "Couve", "Brócolis", "Pimentão", "Abobrinha"
        ],
        "Carnes & Aves": [
            "Carne Moída", "Filé de Frango", "Alcatra", "Contra Filé", "Costela",
            "Coxa de Frango", "Sobrecoxa", "Salsicha", "Linguiça", "Peixe", "Bacon",
            "Patinho", "Coxão Mole", "Maminha"
        ],
        "Frios & Laticínios": [
            "Leite", "Manteiga", "Queijo Mussarela", "Presunto", "Iogurte", "Ovos",
            "Requeijão", "Margarina", "Queijo Prato", "Mortadela", "Salame", "Peito de Peru"
        ],
        "Padaria": [
            "Pão Francês", "Pão de Forma", "Bisnaga", "Bolo", "Pão de Queijo", "Torrada"
        ],
        "Limpeza": [
            "Detergente", "Sabão em Pó", "Lava Roupa", "Lava Roupas Líquido", "Sabão Líquido", "Água Sanitária",
            "Amaciante", "Esponja", "Desinfetante", "Desengordurante", "Limpa Vidros",
            "Saco de Lixo", "Papel Toalha", "Vassoura", "Rodo", "Pano de Prato"
        ],
        "Higiene": [
            "Papel Higiênico", "Sabonete", "Pasta de Dente", "Shampoo", "Condicionador",
            "Fio Dental", "Enxaguante Bucal", "Desodorante", "Absorvente", "Algodão"
        ],
        "Pet Shop": [
            "Ração para Cães", "Ração para Gatos", "Areia Sanitária", "Petisco"
        ]
    };

    for (const [category, items] of Object.entries(defaultCatalog)) {
        for (const name of items) {
            await (prisma as any).catalogProduct.upsert({
                where: { name },
                update: { category },
                create: { name, category },
            });
        }
    }
    // removed cache revalidation; pages will read from DB directly
}

export async function createCatalogProduct(name: string, category?: string) {
    try {
        await (prisma as any).catalogProduct.upsert({
            where: { name },
            update: { category },
            create: { name, category },
        });
        return { success: true };
    } catch (error) {
        console.error("Error creating catalog product:", error);
        return { success: false, error: "Falha ao cadastrar produto" };
    }
}
