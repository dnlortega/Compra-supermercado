import { NextResponse } from "next/server";
import { importOpenListToPriceHistory } from "@/app/actions/price-history";

export async function POST(req: Request) {
    try {
        const result = await importOpenListToPriceHistory();
        return NextResponse.json({ success: true, result });
    } catch (err) {
        console.error('import-open-list error', err);
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
