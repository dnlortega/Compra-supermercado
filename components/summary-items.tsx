"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateProduct } from "@/app/actions/products";

interface Product {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number | null;
}

export function SummaryItems({ products }: { products: Product[] }) {
    const router = useRouter();
    const flattenedItems = products.flatMap((product) => {
        const items = [];
        const unitPrice = product.unitPrice ?? 0;
        for (let i = 0; i < product.quantity; i++) {
            items.push({
                ...product,
                displayQuantity: 1,
                displayTotal: unitPrice,
                unitKey: `${product.id}-${i}`,
                itemIndex: i
            });
        }
        return items;
    });

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
    const [removingItems, setRemovingItems] = useState<Record<string, boolean>>({});

    const toggleCheck = async (item: typeof flattenedItems[0]) => {
        const unitKey = item.unitKey;
        const isCurrentlyChecked = checkedItems[unitKey];

        // Se está marcando como checked, vamos remover 1 unidade do produto
        if (!isCurrentlyChecked) {
            setRemovingItems(prev => ({ ...prev, [unitKey]: true }));
            try {
                // Buscar o produto atual para ver a quantidade
                const productItems = flattenedItems.filter(p => p.id === item.id);
                const currentQuantity = productItems.length;

                if (currentQuantity <= 1) {
                    // Último item, remove o produto completamente
                    const response = await fetch(`/api/product/${item.id}`, {
                        method: 'DELETE',
                    });
                    const data = await response.json();
                    if (response.ok && data.success) {
                        toast.success("Produto removido");
                        router.refresh();
                        return;
                    } else {
                        toast.error(data?.error || "Erro ao remover produto");
                    }
                } else {
                    // Diminui a quantidade em 1
                    await updateProduct(item.id, { quantity: currentQuantity - 1 });
                    toast.success("Item removido");
                    router.refresh();
                }
            } catch (error) {
                console.error("Error removing product:", error);
                toast.error("Erro ao remover produto");
            } finally {
                setRemovingItems(prev => {
                    const newState = { ...prev };
                    delete newState[unitKey];
                    return newState;
                });
            }
        } else {
            // Desmarcando - apenas atualiza o estado local (não faz nada, pois já foi removido)
            setCheckedItems(prev => ({
                ...prev,
                [unitKey]: false
            }));
        }
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10">#</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead className="w-16">Ações</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-12 text-center">Check</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {flattenedItems.map((item, index) => {
                        const isChecked = checkedItems[item.unitKey];
                        const isRemoving = removingItems[item.unitKey];
                        return (
                            <TableRow
                                key={item.unitKey}
                                className={isChecked ? "bg-muted/50 text-muted-foreground line-through transition-colors opacity-60" : "transition-colors"}
                            >
                                <TableCell className="text-muted-foreground text-xs font-mono">{index + 1}</TableCell>
                                <TableCell className="font-medium break-words whitespace-normal">{item.name}</TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`/api/product/${item.id}`, {
                                                    method: 'DELETE',
                                                });

                                                const data = await response.json();

                                                if (response.ok && data.success) {
                                                    toast.success("Produto removido");
                                                    router.refresh();
                                                } else {
                                                    toast.error(data?.error || "Erro ao remover produto");
                                                }
                                            } catch (e) {
                                                console.error("Error deleting product:", e);
                                                toast.error("Erro ao remover produto");
                                            }
                                        }}
                                        disabled={isRemoving}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </TableCell>
                                <TableCell className="text-right">{item.displayQuantity}</TableCell>
                                <TableCell className="text-right">{item.unitPrice !== null ? formatCurrency(item.unitPrice) : "-"}</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(item.displayTotal)}</TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant={isChecked ? "secondary" : "outline"}
                                        size="icon"
                                        className={`h-7 w-7 rounded-full border-2 ${isChecked ? 'bg-green-500/20 text-green-600 border-green-500/50 hover:bg-green-500/30' : 'hover:border-green-500 hover:text-green-600'}`}
                                        onClick={() => toggleCheck(item)}
                                        disabled={isRemoving}
                                    >
                                        <Check className={`h-4 w-4 ${isChecked ? 'opacity-100' : 'opacity-20'}`} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {flattenedItems.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                Nenhum produto cadastrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
