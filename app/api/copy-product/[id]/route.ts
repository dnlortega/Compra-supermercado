import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
        }

        // Find product with its shopping list
        const product = await prisma.product.findUnique({
            where: { id },
            include: { shoppingList: true }
        });

        if (!product) {
            return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
        }

        if (product.unitPrice === null || product.unitPrice === undefined) {
            return NextResponse.json({ success: false, error: 'Product has no unitPrice' }, { status: 400 });
        }

        const purchaseDate = product.shoppingList?.date ?? new Date();

        // Create price history entry
        const created = await prisma.priceHistory.create({
            data: {
                productName: product.name,
                unitPrice: product.unitPrice,
                purchaseDate,
            },
        });

        revalidatePath("/prices");

        return NextResponse.json({ success: true, result: created });
    } catch (err: any) {
        console.error('copy-product error', err);
        return NextResponse.json({
            success: false,
            error: err?.message || 'Failed to copy product to price history'
        }, { status: 500 });
    }
}
