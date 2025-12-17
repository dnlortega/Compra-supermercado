"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { updateProduct } from "@/app/actions/products";
import { savePriceHistory, getLastPrice, getPriceHistory } from "@/app/actions/price-history";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, TrendingUp, TrendingDown } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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

export default function PriceList({ initialProducts }: { initialProducts: Product[] }) {
    const groupedProducts = initialProducts.reduce((acc, product) => {
        const category = product.category || "Outros";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    const categories = Object.keys(groupedProducts).sort();

    return (
        <div className="space-y-6">
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
    const [unitPrice, setUnitPrice] = useState<string>(product.unitPrice?.toString() || "");
    const [total, setTotal] = useState<number>(product.totalPrice || 0);
    const [loading, setLoading] = useState(false);
    const [lastPrice, setLastPrice] = useState<number | null>(null);
    const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);

    useEffect(() => {
        loadLastPrice();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        if (!unitPrice) return;
        const val = parseFloat(unitPrice.replace(",", "."));
        if (isNaN(val)) return;
        if (val === product.unitPrice) return;

        setLoading(true);
        try {
            await updateProduct(product.id, { unitPrice: val });
            await savePriceHistory(product.name, val);
            setTotal(val * product.quantity);
            setLastPrice(val);
            toast.success("Preço salvo");
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (val: string) => {
        setUnitPrice(val);
        const num = parseFloat(val.replace(",", "."));
        if (!isNaN(num)) {
            setTotal(num * product.quantity);
        }
    };

    const useLastPrice = () => {
        if (lastPrice) {
            setUnitPrice(lastPrice.toString());
            setTotal(lastPrice * product.quantity);
        }
    };

    const priceDifference = lastPrice && unitPrice ? parseFloat(unitPrice.replace(",", ".")) - lastPrice : 0;

    return (
        <Card className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Qtd: {product.quantity}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-green-600">{formatCurrency(total)}</p>
                </div>
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
                <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground">R$</span>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={unitPrice}
                        onChange={(e) => handleChange(e.target.value)}
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
