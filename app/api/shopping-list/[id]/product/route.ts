
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
        const { name, quantity, unitPrice, category = "Outros" } = body;

        if (!name || !quantity) {
            return NextResponse.json({ error: "Name and quantity are required" }, { status: 400 });
        }

        // Calculate total price if unitPrice is provided
        const totalPrice = unitPrice ? unitPrice * quantity : null;

        // Create the product
        const product = await prisma.product.create({
            data: {
                name,
                quantity,
                unitPrice,
                totalPrice,
                category,
                shoppingListId: id,
            },
        });

        // Recalculate list total
        const list = await prisma.shoppingList.findUnique({
            where: { id },
            include: { products: true },
        });

        if (list) {
            const newTotal = list.products.reduce((acc: number, p: any) => acc + (p.totalPrice || 0), 0);

            await prisma.shoppingList.update({
                where: { id },
                data: { total: newTotal },
            });
        }

        revalidatePath("/list");
        revalidatePath("/history");

        // removed cache revalidation; pages will read from DB directly

        return NextResponse.json(product);
    } catch (_error) {
        console.error("Error adding product:", _error);
        return NextResponse.json({ error: "Failed to add product" }, { status: 500 });
    }
}
