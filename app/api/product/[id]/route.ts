import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Find item and its list
        const item = await prisma.shoppingListItem.findUnique({
            where: { id },
            include: { shoppingList: true },
        });

        if (!item) {
            return NextResponse.json({ error: "Item não encontrado" }, { status: 404 });
        }

        const listId = item.shoppingListId;

        // Delete the item
        await prisma.shoppingListItem.delete({ where: { id } });

        // Recalculate list total if list exists
        if (listId) {
            try {
                const list = await prisma.shoppingList.findUnique({
                    where: { id: listId },
                    include: { items: true },
                });

                if (list) {
                    const newTotal = list.items.reduce((acc: number, i: any) => acc + (i.totalPrice || 0), 0);
                    await prisma.shoppingList.update({
                        where: { id: listId },
                        data: { total: newTotal },
                    });
                }
            } catch (err) {
                console.error('Error updating list total:', err);
            }
        }

        revalidatePath("/");
        revalidatePath("/list");
        revalidatePath("/prices");
        revalidatePath("/summary");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: error?.message || "Erro ao deletar produto" }, { status: 500 });
    }
}

