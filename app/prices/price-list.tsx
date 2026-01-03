"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { updateProduct } from "@/app/actions/products";
import { savePriceHistory, getLastPrice, getPriceHistory } from "@/app/actions/price-history";
import { updateShoppingListDate } from "@/app/actions/shopping-lists";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, TrendingUp, TrendingDown, Calendar, Trash2, Search } from "lucide-react";
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
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("Tudo");

    // Extrair categorias únicas presentes na lista
    const allCategories = useMemo(() => {
        const cats = new Set(initialProducts.map(p => p.category || "Outros"));
        return ["Tudo", ...Array.from(cats).sort()];
    }, [initialProducts]);

    // Filtrar produtos baseados no termo de busca e categoria selecionada
    const filteredProducts = useMemo(() => {
        return initialProducts.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === "Tudo" || (product.category || "Outros") === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [initialProducts, searchTerm, selectedCategory]);

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

    const { pendentes, groupedSortedProducts, pricedCategories } = useMemo(() => {
        const pends: Product[] = [];
        const normalGrouped: Record<string, Product[]> = {};

        filteredProducts.forEach(product => {
            const isPendente = !product.unitPrice || product.unitPrice === 0;
            if (isPendente) {
                pends.push(product);
            } else {
                const category = product.category || "Outros";
                if (!normalGrouped[category]) normalGrouped[category] = [];
                normalGrouped[category].push(product);
            }
        });

        // Ordenar pendentes por nome
        pends.sort((a, b) => a.name.localeCompare(b.name));

        // Ordenar produtos dentro de cada categoria por nome
        Object.keys(normalGrouped).forEach(cat => {
            normalGrouped[cat].sort((a, b) => a.name.localeCompare(b.name));
        });

        return {
            pendentes: pends,
            groupedSortedProducts: normalGrouped,
            pricedCategories: Object.keys(normalGrouped).sort()
        };
    }, [filteredProducts]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {initialProducts.length > 0 && (
                <div className="space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar produto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 h-11"
                        />
                    </div>

                    {/* Catálogos (Filtros de Categoria) */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
                        {allCategories.map((cat) => (
                            <Button
                                key={cat}
                                variant={selectedCategory === cat ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat)}
                                className="whitespace-nowrap rounded-full px-4 h-8 text-xs font-semibold"
                            >
                                {cat}
                            </Button>
                        ))}
                    </div>
                </div>
            )}

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

            {pendentes.length > 0 && (
                <div className="space-y-3">
                    <h3 className="font-bold text-amber-600 ml-2 uppercase text-xs tracking-wider flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                        Itens Pendentes ({pendentes.length})
                    </h3>
                    {pendentes.map((product) => (
                        <PriceItem key={product.id} product={product} />
                    ))}
                </div>
            )}

            {pricedCategories.map((category) => (
                <div key={category} className="space-y-3">
                    <h3 className="font-semibold text-muted-foreground ml-2 uppercase text-xs tracking-wider">{category}</h3>
                    {groupedSortedProducts[category].map((product) => (
                        <PriceItem key={product.id} product={product} />
                    ))}
                </div>
            ))}
            {initialProducts.length === 0 && (
                <p className="text-center text-muted-foreground p-8">Sua lista está vazia.</p>
            )}
            {initialProducts.length > 0 && filteredProducts.length === 0 && (
                <p className="text-center text-muted-foreground p-8">Nenhum produto encontrado.</p>
            )}
        </div>
    );
}

function PriceItem({ product }: { product: Product }) {
    const hasNoPrice = !product.unitPrice || product.unitPrice === 0;

    const [unitPrice, setUnitPrice] = useState<number>(product.unitPrice || 0);
    const [quantity, setQuantity] = useState<string>(product.quantity.toString());
    const [total, setTotal] = useState<number>(product.totalPrice || 0);
    const [loading, setLoading] = useState(false);
    const [lastPrice, setLastPrice] = useState<number | null>(null);
    const [priceHistory, setPriceHistory] = useState<PriceHistoryEntry[]>([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [isEditing, setIsEditing] = useState(hasNoPrice);

    // Sincronizar estado quando produto mudar (apenas quando o ID do produto mudar)
    useEffect(() => {
        setUnitPrice(product.unitPrice || 0);
        setQuantity(product.quantity.toString());
        setTotal(product.totalPrice || 0);
        setIsEditing(!product.unitPrice || product.unitPrice === 0);
    }, [product.id, product.unitPrice]);

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

        if (!priceChanged && !qtyChanged) {
            setIsEditing(false);
            return;
        }

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
            setIsEditing(false);
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
        <Card
            onClick={() => !isEditing && setIsEditing(true)}
            className={`relative overflow-hidden transition-all duration-300 border-l-4 cursor-pointer ${isEditing ? 'ring-2 ring-primary/20 shadow-md' : 'hover:bg-muted/50'
                } ${hasNoPrice ? 'border-l-amber-500 bg-amber-50/5 animate-pulse-subtle' : 'border-l-green-500 bg-card shadow-sm'
                }`}
        >
            <div className="p-4 space-y-4">
                {/* Cabeçalho do Card */}
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-black tracking-tight transition-all ${isEditing ? 'text-lg' : 'text-base'}`}>
                                {product.name}
                            </h3>
                            {!isEditing && !hasNoPrice && (
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {quantity} UN
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 items-center">
                            {product.category && (
                                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold border">
                                    {product.category}
                                </span>
                            )}
                            {lastPrice && hasNoPrice && isEditing && (
                                <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold border border-blue-200 dark:border-blue-800">
                                    SUGESTÃO: {formatCurrency(lastPrice)}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="text-right shrink-0">
                        <div className={`font-black tabular-nums transition-all ${isEditing ? 'text-2xl' : 'text-lg'} ${hasNoPrice ? 'text-amber-600' : 'text-green-600'}`}>
                            {hasNoPrice ? "R$ ---" : formatCurrency(total)}
                        </div>
                        {hasNoPrice && isEditing && (
                            <div className="text-[10px] font-black uppercase text-amber-500 animate-pulse">
                                Aguardando Preço
                            </div>
                        )}
                        {!isEditing && !hasNoPrice && (
                            <div className="text-[10px] font-bold text-muted-foreground uppercase">
                                {formatCurrency(unitPrice)} / un
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="animate-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dashed">
                            {/* Coluna Quantidade */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Qtd</Label>
                                </div>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQtyChange(e.target.value)}
                                    onBlur={handleBlur}
                                    onFocus={(e) => e.target.select()}
                                    disabled={loading}
                                    autoFocus
                                    className="h-12 text-xl font-bold bg-muted/30 border-2 focus:border-primary transition-all"
                                />
                            </div>

                            {/* Coluna Preço Unitário */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Preço Unitário</Label>
                                    {lastPrice && (
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                useLastPrice();
                                            }}
                                            className="h-6 px-2 text-[10px] font-black bg-blue-500 text-white hover:bg-blue-600 shadow-sm border-none"
                                        >
                                            USAR ÚLTIMO
                                        </Button>
                                    )}
                                </div>
                                <div className="relative flex gap-2">
                                    <CurrencyInput
                                        placeholder="0,00"
                                        value={unitPrice}
                                        onValueChange={handlePriceChange}
                                        onBlur={handleBlur}
                                        onFocus={(e) => e.target.select()}
                                        disabled={loading}
                                        className="h-12 text-xl font-bold bg-muted/30 border-2 focus:border-primary transition-all flex-1"
                                    />
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    loadPriceHistory();
                                                }}
                                                disabled={loadingHistory}
                                                className="h-12 w-12 shrink-0 bg-background border-2"
                                            >
                                                <History className="h-5 w-5" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80" align="end" onClick={(e) => e.stopPropagation()}>
                                            <div className="space-y-3 p-1">
                                                <h4 className="font-black text-sm uppercase tracking-wider border-b pb-2">Histórico de Preços</h4>
                                                {priceHistory.length === 0 ? (
                                                    <p className="text-xs text-muted-foreground py-4 text-center">Nenhum histórico encontrado</p>
                                                ) : (
                                                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                                                        {priceHistory.map((entry) => (
                                                            <div key={entry.id} className="flex justify-between items-center text-sm p-2 rounded bg-muted/30 border">
                                                                <span className="text-muted-foreground font-bold">
                                                                    {format(new Date(entry.purchaseDate), "dd/MM/yyyy", { locale: ptBR })}
                                                                </span>
                                                                <span className="font-black text-primary">{formatCurrency(entry.unitPrice)}</span>
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

                        {/* Rodapé do Card */}
                        <div className="flex items-center justify-between pt-2">
                            <div className="flex-1">
                                {priceDifference !== 0 && lastPrice && (
                                    <div className={`flex items-center gap-1.5 text-xs font-bold ${priceDifference > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                        {priceDifference > 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        <span>
                                            {priceDifference > 0 ? '+' : ''}{formatCurrency(Math.abs(priceDifference))} VS ÚLTIMA COMPRA
                                        </span>
                                    </div>
                                )}
                            </div>

                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-2 group"
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    if (!confirm(`REMOVER ${product.name.toUpperCase()}?`)) return;
                                    try {
                                        const response = await fetch(`/api/product/${product.id}`, {
                                            method: 'DELETE',
                                        });
                                        const data = await response.json();
                                        if (response.ok && data.success) {
                                            toast.success("PRODUTO REMOVIDO");
                                            window.location.reload();
                                        }
                                    } catch (e) {
                                        console.error("Error deleting product:", e);
                                        toast.error("ERRO AO REMOVER");
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4 mr-1 opacity-70 group-hover:opacity-100" />
                                <span className="text-[10px] font-black uppercase">Excluir</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
