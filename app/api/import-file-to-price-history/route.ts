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
                // Try multiple possible field names for product name
                const name = String(
                    p.name || 
                    p.productName || 
                    p.catalogProduct?.name ||
                    p.catalogProduct?.name ||
                    ''
                ).trim();
                
                if (!name) {
                    console.warn('Produto sem nome ignorado:', p);
                    continue;
                }

                // Calculate unitPrice from various possible fields
                let unitPrice = 0;
                if (typeof p.unitPrice === 'number' && p.unitPrice > 0) {
                    unitPrice = p.unitPrice;
                } else if (p.totalPrice && p.quantity && Number(p.quantity) > 0) {
                    unitPrice = Number(p.totalPrice) / Number(p.quantity);
                } else if (typeof p.unitPrice === 'string') {
                    unitPrice = parseFloat(p.unitPrice) || 0;
                }
                
                // Skip if no valid price
                if (!unitPrice || unitPrice <= 0) {
                    console.warn(`Produto "${name}" ignorado: preço inválido (unitPrice: ${p.unitPrice}, totalPrice: ${p.totalPrice}, quantity: ${p.quantity})`);
                    continue;
                }

                const purchaseDate = p.purchaseDate 
                    ? new Date(p.purchaseDate) 
                    : (shoppingDate || (p.createdAt ? new Date(p.createdAt) : undefined));

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
                        unitPrice: Number(unitPrice),
                        purchaseDate: purchaseDate || new Date(),
                        storeId,
                        userId
                    },
                });
                created.push({
                    id: entry.id,
                    productName: name,
                    unitPrice: entry.unitPrice,
                    purchaseDate: entry.purchaseDate
                });
            } catch (innerErr: any) {
                console.error('Erro ao importar item de histórico', {
                    product: p,
                    error: innerErr?.message || String(innerErr),
                    stack: innerErr?.stack
                });
            }
        }

        return NextResponse.json({ 
            success: true, 
            createdCount: created.length,
            created: created
        });
    } catch (err: any) {
        console.error('import-file-to-price-history error', err);
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
