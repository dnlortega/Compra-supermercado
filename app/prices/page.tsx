import { getProducts } from "@/app/actions/products";
export const dynamic = "force-dynamic";
import { getOpenList } from "@/app/actions/shopping-lists";
import PriceList from "./price-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, History, Receipt } from "lucide-react";

export default async function PricesPage() {
    const products = await getProducts();
    const currentList = await getOpenList();

    return (
        <div className="container mx-auto p-4 max-w-2xl bg-background min-h-screen">
            <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">
                        <Receipt className="h-8 w-8 text-primary" />
                        <span className="sr-only">Preencher Valores</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/prices/price-history-admin">
                        <Button variant="outline" size="icon" title="Histórico de Preços">
                            <History className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
            <PriceList
                initialProducts={products}
                listId={currentList?.id}
                initialDate={currentList?.date ? new Date(currentList.date) : new Date()}
            />
        </div>
    );
}
