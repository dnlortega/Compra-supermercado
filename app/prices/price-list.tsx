"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { updateProduct } from "@/app/actions/products";
import { savePriceHistory, getLastPrice, getPriceHistory } from "@/app/actions/price-history";
import { updateShoppingListDate } from "@/app/actions/shopping-lists";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, TrendingUp, TrendingDown, Calendar, Trash2 } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Label } from "@/components/ui/label";

interface Product {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number | null;
    checked: boolean;
    category?: string;
}

interface PriceHistoryEntry {
    id: string;
    unitPrice: number;
    purchaseDate: Date;
}

export default function PriceList({
    initialProducts,
    listId,
    initialDate
}: {
    initialProducts: Product[],
    listId?: string,
    initialDate: Date
}) {
    // Format to YYYY-MM-DD correctly without timezone shifts for the input value
    const [date, setDate] = useState<string>(() => {
        const d = new Date(initialDate);
        return d.toISOString().split('T')[0];
    });

    const handleDateChange = async (newDate: string) => {
        setDate(newDate);
        if (listId) {
            try {
                await updateShoppingListDate(listId, newDate);
                toast.success("Data da compra atualizada");
            } catch {
                toast.error("Erro ao atualizar data");
            }
        }
    };

    const groupedProducts = initialProducts.reduce((acc, product) => {
        const category = product.category || "Outros";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        // Sort within category: null/0 prices first
        acc[category].sort((a, b) => {
            const aHasPrice = a.unitPrice && a.unitPrice > 0;
            const bHasPrice = b.unitPrice && b.unitPrice > 0;
            if (aHasPrice === bHasPrice) return a.name.localeCompare(b.name);
            return aHasPrice ? 1 : -1;
        });
        return acc;
    }, {} as Record<string, Product[]>);

    const categories = Object.keys(groupedProducts).sort();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <Card className="p-4 bg-muted/50 border-none shadow-none">
                <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Data da Compra
                    </Label>
                    <Input
                        type="date"
                        value={date}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className="bg-background"
                    />
                </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg">
                    <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-tighter mb-1">Mais Caro</p>
                    {(() => {
                        const priced = initialProducts.filter(p => p.unitPrice && p.unitPrice > 0);
                        const mostExpensive = priced.length > 0 ? priced.reduce((prev, curr) => (prev.unitPrice || 0) > (curr.unitPrice || 0) ? prev : curr) : null;
                        return mostExpensive ? (
                            <div className="truncate">
                                <span className="text-xs font-bold block truncate">{mostExpensive.name}</span>
                                <span className="text-sm font-black text-red-700 dark:text-red-300">{formatCurrency(mostExpensive.unitPrice || 0)}</span>
                            </div>
                        ) : <span className="text-xs text-muted-foreground">--</span>;
                    })()}
                </div>
                <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-lg">
                    <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-1">Mais Barato</p>
                    {(() => {
                        const priced = initialProducts.filter(p => p.unitPrice && p.unitPrice > 0);
                        const cheapest = priced.length > 0 ? priced.reduce((prev, curr) => (prev.unitPrice || 0) < (curr.unitPrice || 0) ? prev : curr) : null;
                        return cheapest ? (
                            <div className="truncate">
                                <span className="text-xs font-bold block truncate">{cheapest.name}</span>
                                <span className="text-sm font-black text-blue-700 dark:text-blue-300">{formatCurrency(cheapest.unitPrice || 0)}</span>
                            </div>
                        ) : <span className="text-xs text-muted-foreground">--</span>;
                    })()}
                </div>
            </div>

            {categories.map((category) => (
                <div key={category} className="space-y-3">
                    <h3 className="font-semibold text-muted-foreground ml-2 uppercase text-xs tracking-wider">{category}</h3>
                    {groupedProducts[category].map((product) => (
                        <PriceItem key={product.id} product={product} />
                    ))}
                </div>
            ))}
            {initialProducts.length === 0 && (
                <p className="text-center text-muted-foreground p-8">Sua lista está vazia.</p>
            )}
        </div>
    );
}

function PriceItem({ product }: { product: Product }) {
    const [unitPrice, setUnitPrice] = useState<number>(product.unitPrice || 0);
    const [quantity, setQuantity] = useState<string>(product.quantity.toString());
    const [total, setTotal] = useState<number>(product.totalPrice || 0);
    const [loading, setLoading] = useState(false);
    const [lastPrice, setLastPrice] = useState<number | null>(null);
    const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    // Sincronizar estado quando produto mudar (apenas quando o ID do produto mudar)
    useEffect(() => {
        setUnitPrice(product.unitPrice || 0);
        setQuantity(product.quantity.toString());
        setTotal(product.totalPrice || 0);
    }, [product.id]);

    useEffect(() => {
        loadLastPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product.name]);

    const loadLastPrice = async () => {
        const price = await getLastPrice(product.name);
        setLastPrice(price);
    };

    const loadPriceHistory = async () => {
        setLoadingHistory(true);
        try {
            const history = await getPriceHistory(product.name);
            setPriceHistory(history);
        } finally {
            setLoadingHistory(false);
        }
    };

    const handleBlur = async () => {
        const valPrice = unitPrice;
        const valQty = parseInt(quantity);

        // Normalizar valores para comparação
        const currentUnitPrice = product.unitPrice ?? 0;
        const normalizedValPrice = valPrice || 0;
        const normalizedCurrentPrice = currentUnitPrice || 0;

        // Se mudou preço ou quantidade
        const priceChanged = Math.abs(normalizedValPrice - normalizedCurrentPrice) > 0.001;
        const qtyChanged = !isNaN(valQty) && valQty !== product.quantity;

        if (!priceChanged && !qtyChanged) return;

        setLoading(true);
        try {
            await updateProduct(product.id, {
                unitPrice: valPrice > 0 ? valPrice : undefined,
                quantity: !isNaN(valQty) ? valQty : undefined
            });

            if (priceChanged && valPrice > 0) {
                await savePriceHistory(product.name, valPrice);
            }

            const currentPrice = valPrice > 0 ? valPrice : (product.unitPrice || 0);
            const currentQty = !isNaN(valQty) ? valQty : product.quantity;

            setTotal(currentPrice * currentQty);
            if (priceChanged && valPrice > 0) setLastPrice(valPrice);
            toast.success("Alterações salvas");
        } catch (error) {
            console.error("Error saving product:", error);
            toast.error("Erro ao salvar");
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (val: number) => {
        setUnitPrice(val);
        const numQty = parseInt(quantity);
        if (!isNaN(val) && !isNaN(numQty)) {
            setTotal(val * numQty);
        } else if (!isNaN(val)) {
            setTotal(val * product.quantity);
        }
    };

    const handleQtyChange = (val: string) => {
        setQuantity(val);
        const numQty = parseInt(val);
        const numPrice = unitPrice;
        if (!isNaN(numQty) && !isNaN(numPrice)) {
            setTotal(numQty * numPrice);
        } else if (!isNaN(numQty) && product.unitPrice) {
            setTotal(numQty * product.unitPrice);
        }
    };

    const useLastPrice = () => {
        if (lastPrice) {
            setUnitPrice(lastPrice);
            setTotal(lastPrice * product.quantity);
        }
    };

    const priceDifference = lastPrice && unitPrice ? unitPrice - lastPrice : 0;

    return (
        <Card className="p-4 flex flex-col gap-2 animate-in zoom-in-95 duration-300">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-green-600">{formatCurrency(total)}</p>
                </div>
            </div>

            <div className="flex justify-end mt-2">
                <Button variant="ghost" size="icon" onClick={async () => {
                    try {
                        const response = await fetch(`/api/product/${product.id}`, {
                            method: 'DELETE',
                        });
                        
                        const data = await response.json();
                        
                        if (response.ok && data.success) {
                            toast.success("Produto removido");
                            requestAnimationFrame(() => {
                                window.location.reload();
                            });
                        } else {
                            toast.error(data?.error || "Erro ao remover produto");
                        }
                    } catch (e) {
                        console.error("Error deleting product:", e);
                        toast.error("Erro ao remover produto");
                    }
                }}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </div>

            <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-muted-foreground">Valor Unitário</label>
                    {lastPrice && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                Último: {formatCurrency(lastPrice)}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={useLastPrice}
                                className="h-6 text-xs"
                            >
                                Usar
                            </Button>
                        </div>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Quantidade</Label>
                        <Input
                            type="number"
                            value={quantity}
                            onChange={(e) => handleQtyChange(e.target.value)}
                            onBlur={handleBlur}
                            disabled={loading}
                            className="text-lg"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label className="text-xs font-medium text-muted-foreground uppercase">Valor Unitário (R$)</Label>
                        <div className="flex gap-2 items-center">
                            <CurrencyInput
                                placeholder="0,00"
                                value={unitPrice}
                                onValueChange={handlePriceChange}
                                onBlur={handleBlur}
                                disabled={loading}
                                className="text-lg"
                            />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={loadPriceHistory}
                                        disabled={loadingHistory}
                                        className="shrink-0"
                                    >
                                        <History className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-2">
                                        <h4 className="font-semibold text-sm">Histórico de Preços</h4>
                                        {priceHistory.length === 0 ? (
                                            <p className="text-sm text-muted-foreground">Nenhum histórico encontrado</p>
                                        ) : (
                                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                                {priceHistory.map((entry) => (
                                                    <div key={entry.id} className="flex justify-between items-center text-sm border-b pb-2">
                                                        <span className="text-muted-foreground">
                                                            {format(new Date(entry.purchaseDate), "dd/MM/yyyy", { locale: ptBR })}
                                                        </span>
                                                        <span className="font-medium">{formatCurrency(entry.unitPrice)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>
                {priceDifference !== 0 && lastPrice && (
                    <div className={`flex items-center gap-1 text-xs ${priceDifference > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {priceDifference > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span>
                            {priceDifference > 0 ? '+' : ''}{formatCurrency(Math.abs(priceDifference))} vs última compra
                        </span>
                    </div>
                )}
            </div>
        </Card>
    );
}
