import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const list = await (prisma as any).shoppingList.findUnique({
            where: { id: params.id },
            include: {
                products: {
                    orderBy: { category: 'asc' }
                }
            },
        });

        if (!list) {
            return NextResponse.json({ error: "List not found" }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (error) {
        console.error("Error fetching shopping list:", error);
        return NextResponse.json({ error: "Failed to fetch list" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        // Delete the shopping list (products will be deleted automatically due to cascade)
        await (prisma as any).shoppingList.delete({
            where: { id: params.id },
        });

        revalidatePath("/history");

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting shopping list:", error);
        return NextResponse.json({ error: "Failed to delete shopping list" }, { status: 500 });
    }
}

