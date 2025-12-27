import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string; productId: string }> }
) {
    try {
        const { id, productId } = await params;
        const body = await request.json();
        const { unitPrice } = body;

        const item = await prisma.shoppingListItem.findUnique({
            where: { id: productId },
        });

        if (!item) {
            return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
        }

        const totalPrice = unitPrice * item.quantity;

        await prisma.shoppingListItem.update({
            where: { id: productId },
            data: {
                unitPrice,
                totalPrice,
            },
        });

        // Recalculate list total
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
        revalidatePaths();

        return NextResponse.json({ success: true });
    } catch (_error) {
        return NextResponse.json({ error: "Falha ao atualizar item" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string; productId: string }> }
) {
    try {
        const { id, productId } = await params;

        // Get item details
        const item = await prisma.shoppingListItem.findUnique({
            where: { id: productId },
            include: { shoppingList: true },
        });

        if (!item) {
            return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
        }

        // Delete the item
        await prisma.shoppingListItem.delete({
            where: { id: productId },
        });

        // Recalculate list total
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

        revalidatePaths();

        return NextResponse.json({ success: true });
    } catch (_error) {
        console.error("Error deleting item:", _error);
        return NextResponse.json({ error: "Falha ao deletar item" }, { status: 500 });
    }
}

function revalidatePaths() {
    revalidatePath("/list");
    revalidatePath("/history");
    revalidatePath("/");
    revalidatePath("/summary");
}

