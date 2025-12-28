"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Helper to get or create the current open shopping list
async function getCurrentListId() {
    const list = await prisma.shoppingList.findFirst({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
    });

    if (list) return list.id;

    const newList = await prisma.shoppingList.create({
        data: {
            status: "OPEN",
            date: new Date(),
        },
    });
    return newList.id;
}

export async function getProducts() {
    try {
        // Find an open list
        const list = await prisma.shoppingList.findFirst({
            where: { status: "OPEN" },
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: {
                        catalogProduct: {
                            include: {
                                category: true
                            }
                        }
                    },
                    orderBy: { createdAt: "desc" }
                }
            },
        });

        if (list) {
            // Flatten to match expected structure if needed, or return adjusted
            return list.items.map(item => ({
                id: item.id,
                name: item.catalogProduct.name,
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                checked: item.checked,
                category: item.catalogProduct.category?.name || "Outros",
                catalogProductId: item.catalogProductId,
                createdAt: item.createdAt,
            }));
        }

        return [];
    } catch (err) {
        console.error("Error in getProducts:", err);
        throw err;
    }
}

export async function getAllProductNames() {
    try {
        const items = await prisma.catalogProduct.findMany({
            select: { name: true },
            orderBy: { name: 'asc' }
        });
        return items.map(p => p.name);
    } catch (err) {
        console.error("Error in getAllProductNames:", err);
        throw err;
    }
}

function determineCategoryName(name: string): string {
    const lower = name.toLowerCase();
    const categories: Record<string, string[]> = {
        "Essenciais": ["feijão", "feijao", "arroz", "açúcar", "acucar", "óleo", "oleo", "macarrão", "macarrao", "café", "cafe", "sal", "farinha", "biscoito", "bolacha", "molho", "extrato", "milho", "ervilha", "maionese", "ketchup", "mostarda", "vinagre", "azeite", "pipoca", "gelatina", "leite condensado", "creme de leite", "achocolatado", "nescau", "toddy", "chá", "cha"],
        "Bebidas": ["água", "agua", "suco", "refrigerante", "coca", "guaraná", "guarana", "cerveja", "vinho", "energético", "energetico", "coco", "chá gelado"],
        "Hortifruti": ["fruta", "legume", "banana", "maçã", "maca", "batata", "cebola", "tomate", "alface", "alho", "cenoura", "abóbora", "abobora", "chuchu", "limão", "limao", "laranja", "pêra", "pera", "melancia", "mamão", "mamao", "abacaxi", "couve", "brócolis", "brocolis", "pimentão", "pimentao", "abobrinha"],
        "Carnes & Aves": ["carne", "frango", "alcatra", "filé", "file", "costela", "coxa", "sobrecoxa", "salsicha", "linguiça", "linguica", "peixe", "bacon", "bife", "hambúrguer", "hamburguer", "patinho", "coxão", "coxao", "maminha"],
        "Frios & Laticínios": ["leite", "manteiga", "queijo", "presunto", "iogurte", "ovo", "requeijão", "requeijao", "margarina", "mortadela", "salame", "peru"],
        "Padaria": ["pão", "pao", "bisnaga", "bolo", "rosca", "torrada"],
        "Limpeza": ["sabão", "sabao", "amaciante", "desinfetante", "pano", "detergente", "vash", "água sanitária", "agua sanitaria", "esponja", "limpa vidro", "desengordurante", "lustra móveis", "lustra moveis", "lixo", "vassoura", "rodo", "lava roupa", "lava roupas líquido", "lava roupas liquido", "sabão líquido", "sabao liquido"],
        "Higiene": ["papel higiênico", "papel higienico", "sabonete", "creme dental", "pasta de dente", "shampoo", "xampu", "condicionador", "desodorante", "escova", "fio dental", "enxaguante", "absorvente", "algodão", "algodao", "lâmina", "lamina", "barbear", "papel toalha", "guardanapo"],
        "Pet Shop": ["ração", "racao", "pet", "cão", "cao", "gato", "areia"]
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(k => lower.includes(k))) return category;
    }
    return "Outros";
}

export async function addProduct(data: { name: string; quantity: number }) {
    try {
        const listId = await getCurrentListId();
        const catName = determineCategoryName(data.name);

        // 1. Ensure category exists
        const category = await prisma.category.upsert({
            where: { name: catName },
            update: {},
            create: { name: catName }
        });

        // 2. Ensure catalog product exists
        const catalogProduct = await prisma.catalogProduct.upsert({
            where: { name: data.name },
            update: { categoryId: category.id },
            create: {
                name: data.name,
                categoryId: category.id
            }
        });

        // 3. Add item to shopping list
        await prisma.shoppingListItem.create({
            data: {
                quantity: data.quantity,
                shoppingListId: listId,
                catalogProductId: catalogProduct.id,
            },
        });

        revalidatePaths();
        return { success: true };
    } catch (error) {
        console.error("Add product error:", error);
        return { success: false, error: "Falha ao adicionar produto" };
    }
}

export async function updateProduct(id: string, data: Partial<{ name: string; quantity: number; unitPrice: number; checked: boolean; unit: any }>) {
    const current = await prisma.shoppingListItem.findUnique({
        where: { id },
        include: { catalogProduct: true }
    });

    if (!current) throw new Error("Item not found");

    let catalogProductId = current.catalogProductId;

    // If name changed, we need to link to a different catalog product
    if (data.name && data.name !== current.catalogProduct.name) {
        const categoryName = determineCategoryName(data.name);

        // Ensure category
        const category = await prisma.category.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName }
        });

        // Ensure catalog product
        const cp = await prisma.catalogProduct.upsert({
            where: { name: data.name },
            update: { categoryId: category.id },
            create: { name: data.name, categoryId: category.id }
        });
        catalogProductId = cp.id;
    }

    const quantity = data.quantity ?? current.quantity;
    const unitPrice = data.unitPrice !== undefined ? data.unitPrice : current.unitPrice;

    let totalPrice = current.totalPrice;
    if (unitPrice !== null && unitPrice !== undefined) {
        totalPrice = quantity * unitPrice;
    }

    const updateData: any = {
        quantity,
        unitPrice,
        totalPrice,
        catalogProductId,
    };

    if (data.checked !== undefined) updateData.checked = data.checked;
    if (data.unit !== undefined) updateData.unit = data.unit;

    await prisma.shoppingListItem.update({
        where: { id },
        data: updateData,
    });
    revalidatePaths();
}

export async function deleteProduct(id: string) {
    try {
        await prisma.shoppingListItem.delete({ where: { id } });
        revalidatePaths();
        return { success: true };
    } catch (error: any) {
        console.error("Error in deleteProduct:", error);
        return { success: false, error: error?.message || "Erro ao deletar produto" };
    }
}

function revalidatePaths() {
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
    revalidatePath("/history");
    revalidatePath("/");
}
// cache revalidation removed — we force components/pages to read from DB
