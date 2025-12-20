import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log('import-file-to-price-history.received keys:', Object.keys(body || {}));
        if (!body || !Array.isArray(body.products)) {
            console.warn('import-file-to-price-history: products missing or invalid', { bodyKeys: Object.keys(body || {}), sample: body?.products?.slice?.(0,1) });
            return NextResponse.json({ success: false, error: 'JSON inválido: campo "products" não encontrado', receivedKeys: Object.keys(body || {}) }, { status: 400 });
        }

        const shoppingDate = body.date ? new Date(body.date) : undefined;

        const created: any[] = [];

        for (const p of body.products) {
            try {
                const unitPrice = typeof p.unitPrice === 'number' ? p.unitPrice : (p.totalPrice && p.quantity ? Number(p.totalPrice) / Number(p.quantity) : 0);
                const purchaseDate = p.purchaseDate ? new Date(p.purchaseDate) : (shoppingDate || (p.createdAt ? new Date(p.createdAt) : undefined));

                const entry = await prisma.priceHistory.create({
                    data: {
                        productName: String(p.name || p.productName || ''),
                        unitPrice: Number(unitPrice || 0),
                        purchaseDate: purchaseDate || undefined,
                        storeName: p.storeName || null,
                    },
                });
                created.push(entry);
            } catch (innerErr) {
                console.error('Erro ao criar priceHistory para produto', p, innerErr);
            }
        }

        return NextResponse.json({ success: true, created, createdCount: created.length });
    } catch (err: any) {
        console.error('import-file-to-price-history error', err);
        return NextResponse.json({ success: false, error: String(err), stack: err?.stack }, { status: 500 });
    }
}
