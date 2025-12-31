import { getProducts } from "@/app/actions/products";
export const dynamic = "force-dynamic";
export const revalidate = 30; // Revalidar a cada 30 segundos
import AddProductForm from "./add-product-form";
import ProductList from "./product-list";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import ImportOpenListButton from "@/components/import-open-list-button";
import { ListNameEditor } from "@/components/list-name-editor";
import { DeleteListButton } from "@/components/delete-list-button";

export default async function ListPage() {
    const products = await getProducts();

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
                        <ShoppingCart className="h-8 w-8 text-primary" />
                        <span className="sr-only">Lista de Compras</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <ImportOpenListButton />
                    {products.length > 0 && <DeleteListButton hasItems={true} />}
                </div>
            </div>

            <AddProductForm />

            <ListNameEditor />

            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Itens ({products.length})</h2>
                <ProductList initialProducts={products} />
            </div>
        </div>
    );
}
