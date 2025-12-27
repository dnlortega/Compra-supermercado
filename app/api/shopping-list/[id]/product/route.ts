import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, quantity, unitPrice, category: categoryName = "Outros" } = body;

        if (!name || !quantity) {
            return NextResponse.json({ error: "Nome e quantidade são obrigatórios" }, { status: 400 });
        }

        const totalPrice = unitPrice ? unitPrice * quantity : null;

        // 1. Ensure category
        const category = await prisma.category.upsert({
            where: { name: categoryName },
            update: {},
            create: { name: categoryName }
        });

        // 2. Ensure catalog product
        const catalogProduct = await prisma.catalogProduct.upsert({
            where: { name },
            update: { categoryId: category.id },
            create: { name, categoryId: category.id }
        });

        // 3. Create the list item
        const item = await prisma.shoppingListItem.create({
            data: {
                quantity,
                unitPrice,
                totalPrice,
                shoppingListId: id,
                catalogProductId: catalogProduct.id
            },
        });

        // 4. Recalculate list total
        const list = await prisma.shoppingList.findUnique({
            where: { id },
            include: { items: true },
        });

        if (list) {
            const newTotal = list.items.reduce((acc: number, i: any) => acc + (i.totalPrice || 0), 0);
            await prisma.shoppingList.update({
                where: { id },
                data: { total: newTotal },
            });
        }

        revalidatePath("/list");
        revalidatePath("/history");

        return NextResponse.json(item);
    } catch (_error) {
        console.error("Error adding product:", _error);
        return NextResponse.json({ error: "Falha ao adicionar produto" }, { status: 500 });
    }
}
