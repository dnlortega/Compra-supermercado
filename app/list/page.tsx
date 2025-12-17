import { getProducts } from "@/app/actions/products";
import AddProductForm from "./add-product-form";
import ProductList from "./product-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function ListPage() {
    const products = await getProducts();

    return (
        <div className="container mx-auto p-4 max-w-2xl bg-background min-h-screen">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Lista de Compras</h1>
            </div>

            <AddProductForm />

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Itens ({products.length})</h2>
                <ProductList initialProducts={products} />
            </div>
        </div>
    );
}
