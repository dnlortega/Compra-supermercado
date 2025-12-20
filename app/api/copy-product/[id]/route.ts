import { NextResponse } from "next/server";
import { copyProductToPriceHistory } from "@/app/actions/price-history";

export async function POST(req: Request, context: any) {
    try {
        // Next 16 may provide context.params as a Promise — normalize it
        let params = context?.params;
        if (params && typeof params.then === 'function') {
            params = await params;
        }
        const id = params?.id;
        if (!id) return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 });
        const created = await copyProductToPriceHistory(id);
        return NextResponse.json({ success: true, result: created });
    } catch (err) {
        console.error('copy-product error', err);
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
