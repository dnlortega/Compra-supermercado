import { getProducts } from "@/app/actions/products";
import { getOpenList } from "@/app/actions/shopping-lists";
import PriceList from "./price-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function PricesPage() {
    const products = await getProducts();
    const currentList = await getOpenList();

    return (
        <div className="container mx-auto p-4 max-w-2xl bg-background min-h-screen">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Preencher Valores</h1>
            </div>
            <PriceList
                initialProducts={products}
                listId={currentList?.id}
                initialDate={currentList?.date ? new Date(currentList.date) : new Date()}
            />
        </div>
    );
}
