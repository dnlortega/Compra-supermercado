import { getProducts } from "@/app/actions/products";
export const dynamic = "force-dynamic";
export const revalidate = 30; // Revalidar a cada 30 segundos
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, List, PieChart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinishShoppingButton } from "@/components/finish-shopping-button";
import { SummaryItems } from "@/components/summary-items";

export default async function SummaryPage() {
    const products = await getProducts();
    const totalSpent = products.reduce((acc: number, p: any) => acc + (p.totalPrice || 0), 0);

    const pricedProducts = products.filter((p: any) => p.unitPrice && p.unitPrice > 0);
    const mostExpensive = pricedProducts.length > 0
        ? pricedProducts.reduce((prev: any, curr: any) => prev.unitPrice > curr.unitPrice ? prev : curr)
        : null;
    const cheapest = pricedProducts.length > 0
        ? pricedProducts.reduce((prev: any, curr: any) => prev.unitPrice < curr.unitPrice ? prev : curr)
        : null;

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
                        <PieChart className="h-8 w-8 text-primary" />
                        <span className="sr-only">Resumo da Compra</span>
                    </h1>
                </div>

                <div className="flex items-center gap-2">
                    <Link href="/summary/shopping-lists-admin">
                        <Button variant="outline" size="icon" title="Gerenciar Listas">
                            <List className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 mb-8">
                <Card className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-800">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-center text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Gasto</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-4xl font-bold text-center text-green-700 dark:text-green-300">
                            {formatCurrency(totalSpent)}
                        </p>
                    </CardContent>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <Card className="bg-red-50/50 dark:bg-red-900/20 border-red-100 dark:border-red-900/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tighter">Item mais Caro</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {mostExpensive ? (
                                <div className="space-y-1">
                                    <p className="text-sm font-bold break-words whitespace-normal">{mostExpensive.name}</p>
                                    <p className="text-lg font-black text-red-700 dark:text-red-300">{formatCurrency(mostExpensive.unitPrice ?? 0)}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">--</p>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="bg-blue-50/50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/30">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter">Item mais Barato</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {cheapest ? (
                                <div className="space-y-1">
                                    <p className="text-sm font-bold break-words whitespace-normal">{cheapest.name}</p>
                                    <p className="text-lg font-black text-blue-700 dark:text-blue-300">{formatCurrency(cheapest.unitPrice ?? 0)}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">--</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <SummaryItems products={products} />

            <FinishShoppingButton disabled={products.length === 0} />
        </div>
    );
}
