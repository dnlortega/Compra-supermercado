import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await req.json();

        if (!body || !Array.isArray(body.products)) {
            return NextResponse.json({ success: false, error: 'JSON inválido: campo "products" não encontrado' }, { status: 400 });
        }

        const shoppingDate = body.date ? new Date(body.date) : undefined;
        const created: any[] = [];

        for (const p of body.products) {
            try {
                const name = String(p.name || p.productName || '').trim();
                if (!name) continue;

                const unitPrice = typeof p.unitPrice === 'number' ? p.unitPrice : (p.totalPrice && p.quantity ? Number(p.totalPrice) / Number(p.quantity) : 0);
                const purchaseDate = p.purchaseDate ? new Date(p.purchaseDate) : (shoppingDate || (p.createdAt ? new Date(p.createdAt) : undefined));

                // 1. Ensure CatalogProduct exists (linked to user)
                const cp = await prisma.catalogProduct.upsert({
                    where: { name },
                    update: {},
                    create: {
                        name,
                        categoryId: null,
                        userId
                    }
                });

                // 2. Handle store if exists
                let storeId = null;
                const storeName = p.storeName?.trim();
                if (storeName) {
                    const store = await prisma.store.upsert({
                        where: { name: storeName },
                        update: {},
                        create: { name: storeName }
                    });
                    storeId = store.id;
                }

                const entry = await prisma.priceHistory.create({
                    data: {
                        catalogProductId: cp.id,
                        unitPrice: Number(unitPrice || 0),
                        purchaseDate: purchaseDate || new Date(),
                        storeId,
                        userId
                    },
                });
                created.push(entry);
            } catch (innerErr) {
                console.error('Erro ao importar item de histórico', p, innerErr);
            }
        }

        return NextResponse.json({ success: true, createdCount: created.length });
    } catch (err: any) {
        console.error('import-file-to-price-history error', err);
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
