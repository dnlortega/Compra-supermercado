import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
        }

        const userId = session.user.id;
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ success: false, error: 'ID ausente' }, { status: 400 });
        }

        // Find shopping list item and verify ownership
        const item = await prisma.shoppingListItem.findUnique({
            where: { id },
            include: {
                shoppingList: true,
                catalogProduct: true
            }
        });

        if (!item) {
            return NextResponse.json({ success: false, error: 'Item não encontrado' }, { status: 404 });
        }

        if (item.shoppingList.userId !== userId) {
            return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 403 });
        }

        if (item.unitPrice === null || item.unitPrice === undefined) {
            return NextResponse.json({ success: false, error: 'O item não possui preço unitário' }, { status: 400 });
        }

        const purchaseDate = item.shoppingList?.date ?? new Date();

        // Create price history entry linked to catalog product and user
        const created = await prisma.priceHistory.create({
            data: {
                catalogProductId: item.catalogProductId,
                unitPrice: item.unitPrice,
                purchaseDate,
                userId
            },
        });

        revalidatePath("/prices");

        return NextResponse.json({ success: true, result: created });
    } catch (err: any) {
        console.error('copy-product error', err);
        return NextResponse.json({
            success: false,
            error: err?.message || 'Falha ao copiar produto para o histórico'
        }, { status: 500 });
    }
}
