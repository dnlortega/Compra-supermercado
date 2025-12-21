import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Find product and its list
        const product = await (prisma as any).product.findUnique({
            where: { id },
            include: { shoppingList: true },
        });

        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const listId = product.shoppingListId;

        // Delete the product
        await (prisma as any).product.delete({ where: { id } });

        // If there are no other product rows with the same name, remove the catalog entry
        // (but keep price history - it should persist even when product is removed from list)
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
            // Don't throw here, product was already deleted
        }

        // Recalculate list total if list exists
        if (listId) {
            try {
                const list = await (prisma as any).shoppingList.findUnique({
                    where: { id: listId },
                    include: { products: true },
                });

                if (list) {
                    const newTotal = list.products.reduce((acc: number, p: any) => acc + (p.totalPrice || 0), 0);
                    await (prisma as any).shoppingList.update({
                        where: { id: listId },
                        data: { total: newTotal },
                    });
                }
            } catch (err) {
                console.error('Error updating list total:', err);
                // Don't throw, product was already deleted
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Error deleting product:", error);
        return NextResponse.json({ error: error?.message || "Failed to delete product" }, { status: 500 });
    }
}

