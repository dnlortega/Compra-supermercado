"use server";

import { prisma } from "@/lib/db";

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
    const orphanedProducts = await (prisma as any).product.findMany({
        where: { shoppingListId: null },
    });

    if (orphanedProducts.length > 0) {
        const listId = await getCurrentListId();

        await (prisma as any).product.updateMany({
            where: { shoppingListId: null },
            data: { shoppingListId: listId },
        });
    }
}

export async function getProducts() {
    try {
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
    } catch (err) {
        console.error("Error in getProducts:", err);
        throw err;
    }
}

export async function getAllProductNames() {
    try {
        // Return unique product names from the product table (historical + current)
        const items = await (prisma as any).product.findMany({ select: { name: true }, orderBy: { name: 'asc' } });
        const unique = Array.from(new Set(items.map((p: any) => p.name)));
        return unique;
    } catch (err) {
        console.error("Error in getAllProductNames:", err);
        throw err;
    }
}


function determineCategory(name: string): string {
    const lower = name.toLowerCase();

    const categories: Record<string, string[]> = {
        "Essenciais": [
            "feijão", "feijao", "arroz", "açúcar", "acucar", "óleo", "oleo",
            "macarrão", "macarrao", "café", "cafe", "sal", "farinha", "biscoito",
            "bolacha", "molho", "extrato", "milho", "ervilha", "maionese", "ketchup", "mostarda",
            "vinagre", "azeite", "pipoca", "gelatina", "leite condensado", "creme de leite",
            "achocolatado", "nescau", "toddy", "chá", "cha"
        ],
        "Bebidas": [
            "água", "agua", "suco", "refrigerante", "coca", "guaraná", "guarana",
            "cerveja", "vinho", "energético", "energetico", "coco", "chá gelado"
        ],
        "Hortifruti": [
            "fruta", "legume", "banana", "maçã", "maca", "batata", "cebola",
            "tomate", "alface", "alho", "cenoura", "abóbora", "abobora", "chuchu",
            "limão", "limao", "laranja", "pêra", "pera", "melancia", "mamão", "mamao",
            "abacaxi", "couve", "brócolis", "brocolis", "pimentão", "pimentao", "abobrinha"
        ],
        "Carnes & Aves": [
            "carne", "frango", "alcatra", "filé", "file", "costela", "coxa", "sobrecoxa",
            "salsicha", "linguiça", "linguica", "peixe", "bacon", "bife", "hambúrguer", "hamburguer",
            "patinho", "coxão", "coxao", "maminha"
        ],
        "Frios & Laticínios": [
            "leite", "manteiga", "queijo", "presunto", "iogurte", "ovo", "requeijão",
            "requeijao", "margarina", "mortadela", "salame", "peru"
        ],
        "Padaria": [
            "pão", "pao", "bisnaga", "bolo", "rosca", "torrada"
        ],
        "Limpeza": [
            "sabão", "sabao", "amaciante", "desinfetante", "pano", "detergente",
            "vash", "água sanitária", "agua sanitaria", "esponja", "limpa vidro",
            "desengordurante", "lustra móveis", "lustra moveis", "lixo", "vassoura", "rodo",
            "lava roupa", "lava roupas líquido", "lava roupas liquido", "sabão líquido", "sabao liquido"
        ],
        "Higiene": [
            "papel higiênico", "papel higienico", "sabonete", "creme dental", "pasta de dente",
            "shampoo", "xampu", "condicionador", "desodorante", "escova", "fio dental",
            "enxaguante", "absorvente", "algodão", "algodao", "lâmina", "lamina", "barbear",
            "papel toalha", "guardanapo"
        ],
        "Pet Shop": [
            "ração", "racao", "pet", "cão", "cao", "gato", "areia"
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
    try {
        const listId = await getCurrentListId();
        const category = determineCategory(data.name);

        await (prisma as any).product.create({
            data: {
                name: data.name,
                quantity: data.quantity,
                shoppingListId: listId,
                category,
            },
        });

        // removed cache revalidation; pages read directly from DB
        return { success: true };
    } catch (error) {
        console.error("Add product error:", error);
        return { success: false, error: "Falha ao adicionar produto" };
    }
}

export async function updateProduct(id: string, data: Partial<{ name: string; quantity: number; unitPrice: number; checked: boolean }>) {
    const current = await (prisma as any).product.findUnique({ where: { id } });
    if (!current) throw new Error("Product not found");

    const quantity = data.quantity ?? current.quantity;
    const unitPrice = data.unitPrice !== undefined ? data.unitPrice : current.unitPrice;

    let totalPrice = current.totalPrice;
    if (unitPrice !== null && unitPrice !== undefined) {
        totalPrice = quantity * unitPrice;
    }

    await (prisma as any).product.update({
        where: { id },
        data: {
            ...data,
            totalPrice,
        },
    });
    // removed cache revalidation; pages read directly from DB
}

export async function deleteProduct(id: string) {
    // Find product to obtain its name for price history cleanup
    const product = await (prisma as any).product.findUnique({ where: { id } });
    if (product) {
        // Delete all price history entries for this product name (case-insensitive)
        try {
            await (prisma as any).priceHistory.deleteMany({
                where: {
                    productName: {
                        equals: product.name,
                        mode: 'insensitive',
                    },
                },
            });
        } catch (err) {
            console.error('Error deleting price history for product', product.name, err);
        }

        // Delete the product itself
        await (prisma as any).product.delete({ where: { id } });

        // If there are no other product rows with the same name, remove the catalog entry
        try {
            const others = await (prisma as any).product.count({
                where: {
                    name: {
                        equals: product.name,
                        mode: 'insensitive',
                    },
                    id: { not: id },
                },
            });

            if (others === 0) {
                await (prisma as any).catalogProduct.deleteMany({
                    where: {
                        name: {
                            equals: product.name,
                            mode: 'insensitive',
                        },
                    },
                });
            }
        } catch (err) {
            console.error('Error deleting catalog product for', product.name, err);
        }
    }
    // removed cache revalidation; pages read directly from DB
}
// cache revalidation removed — we force components/pages to read from DB
