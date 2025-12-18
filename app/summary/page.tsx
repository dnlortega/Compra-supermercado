import { getProducts } from "@/app/actions/products";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FinishShoppingButton } from "@/components/finish-shopping-button";

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
            <div className="flex items-center gap-4 mb-6">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Resumo da Compra</h1>
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
                                    <p className="text-sm font-bold truncate">{mostExpensive.name}</p>
                                    <p className="text-lg font-black text-red-700 dark:text-red-300">{formatCurrency(mostExpensive.unitPrice)}</p>
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
                                    <p className="text-sm font-bold truncate">{cheapest.name}</p>
                                    <p className="text-lg font-black text-blue-700 dark:text-blue-300">{formatCurrency(cheapest.unitPrice)}</p>
                                </div>
                            ) : (
                                <p className="text-xs text-muted-foreground">--</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Produto</TableHead>
                            <TableHead className="text-right">Qtd</TableHead>
                            <TableHead className="text-right">Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product: any) => (
                            <TableRow key={product.id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell className="text-right">{product.quantity}</TableCell>
                                <TableCell className="text-right">{product.unitPrice ? formatCurrency(product.unitPrice) : "-"}</TableCell>
                                <TableCell className="text-right font-bold">{product.totalPrice ? formatCurrency(product.totalPrice) : "-"}</TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                    Nenhum produto cadastrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <FinishShoppingButton disabled={products.length === 0} />
        </div>
    );
}
