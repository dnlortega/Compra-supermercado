import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PATCH(
    request: Request,
    { params }: { params: { id: string; productId: string } }
) {
    try {
        const body = await request.json();
        const { unitPrice } = body;

        const product = await prisma.product.findUnique({
            where: { id: params.productId },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const totalPrice = unitPrice * product.quantity;

        await prisma.product.update({
            where: { id: params.productId },
            data: {
                unitPrice,
                totalPrice,
            },
        });

        // Recalculate list total
        const list = await (prisma as any).shoppingList.findUnique({
            where: { id: params.id },
            include: { products: true },
        });

        const newTotal = list.products.reduce((acc: number, p: any) => acc + (p.totalPrice || 0), 0);

        await (prisma as any).shoppingList.update({
            where: { id: params.id },
            data: { total: newTotal },
        });

        revalidatePath("/history");
        revalidatePath(`/history/${params.id}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }
}
