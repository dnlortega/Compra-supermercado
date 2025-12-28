import { NextResponse } from "next/server";
import { importOpenListToPriceHistory } from "@/app/actions/price-history";
import { auth } from "@/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 });
        }

        const result = await importOpenListToPriceHistory();
        return NextResponse.json({ success: true, result });
    } catch (err) {
        console.error('import-open-list error', err);
        return NextResponse.json({ success: false, error: String(err) }, { status: 500 });
    }
}
