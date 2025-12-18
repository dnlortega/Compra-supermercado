"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Product {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export function SummaryItems({ products }: { products: Product[] }) {
    const flattenedItems = products.flatMap((product) => {
        const items = [];
        for (let i = 0; i < product.quantity; i++) {
            items.push({
                ...product,
                displayQuantity: 1,
                displayTotal: product.unitPrice || 0,
                unitKey: `${product.id}-${i}`
            });
        }
        return items;
    });

    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

    const toggleCheck = (unitKey: string) => {
        setCheckedItems(prev => ({
            ...prev,
            [unitKey]: !prev[unitKey]
        }));
    };

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-10">#</TableHead>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Qtd</TableHead>
                        <TableHead className="text-right">Unit.</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-12 text-center">Check</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {flattenedItems.map((item, index) => {
                        const isChecked = checkedItems[item.unitKey];
                        return (
                            <TableRow
                                key={item.unitKey}
                                className={isChecked ? "bg-muted/50 text-muted-foreground line-through transition-colors opacity-60" : "transition-colors"}
                            >
                                <TableCell className="text-muted-foreground text-xs font-mono">{index + 1}</TableCell>
                                <TableCell className="font-medium">{item.name}</TableCell>
                                <TableCell className="text-right">{item.displayQuantity}</TableCell>
                                <TableCell className="text-right">{item.unitPrice ? formatCurrency(item.unitPrice) : "-"}</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(item.displayTotal)}</TableCell>
                                <TableCell className="text-center">
                                    <Button
                                        variant={isChecked ? "secondary" : "outline"}
                                        size="icon"
                                        className={`h-7 w-7 rounded-full border-2 ${isChecked ? 'bg-green-500/20 text-green-600 border-green-500/50 hover:bg-green-500/30' : 'hover:border-green-500 hover:text-green-600'}`}
                                        onClick={() => toggleCheck(item.unitKey)}
                                    >
                                        <Check className={`h-4 w-4 ${isChecked ? 'opacity-100' : 'opacity-20'}`} />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                    {flattenedItems.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                Nenhum produto cadastrado.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
