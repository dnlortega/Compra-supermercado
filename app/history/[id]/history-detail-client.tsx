"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit2, Save, X, Trash2, Plus, Download, RotateCcw, Search } from "lucide-react";
import { formatCurrency, determineCategoryName } from "@/lib/utils";
import { exportSingleList } from "@/app/actions/export-import";
import { reopenShoppingList } from "@/app/actions/shopping-lists";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Product {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number | null;
    category?: string;
}

interface ShoppingListDetail {
    id: string;
    name: string | null;
    date: Date;
    total: number;
    products: Product[];
    createdAt: Date;
    updatedAt: Date;
}

export default function HistoryDetailClient({ listId }: { listId: string }) {
    const router = useRouter();
    const [list, setList] = useState<ShoppingListDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState<number>(0);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: "",
        quantity: "",
        unitPrice: 0 as number | null,
        category: "Outros"
    });
    const [isEditingDate, setIsEditingDate] = useState(false);
    const [tempDate, setTempDate] = useState("");
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempName, setTempName] = useState("");
    const [isEditingCreatedAt, setIsEditingCreatedAt] = useState(false);
    const [tempCreatedAt, setTempCreatedAt] = useState("");
    const [isEditingUpdatedAt, setIsEditingUpdatedAt] = useState(false);
    const [tempUpdatedAt, setTempUpdatedAt] = useState("");
    const [searchTerm, setSearchTerm] = useState("");

    // Filtrar produtos baseados no termo de busca
    const filteredProducts = useMemo(() => {
        if (!list) return [];
        return list.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [list, searchTerm]);

    useEffect(() => {
        loadList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId]);

    const loadList = async () => {
        try {
            const response = await fetch(`/api/shopping-list/${listId}`);
            let data = await response.json();

            // Map items to products for component compatibility
            if (data && data.items) {
                data.products = data.items.map((item: any) => ({
                    id: item.id,
                    name: item.catalogProduct?.name || "Produto sem nome",
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.totalPrice,
                    category: item.catalogProduct?.category?.name || "Outros"
                }));
            }

            setList(data);
        } catch (_error) {
            toast.error("Erro ao carregar detalhes");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setEditPrice(product.unitPrice || 0);
    };

    const handleSave = async (productId: string, _quantity: number) => {
        const newPrice = editPrice;
        if (newPrice === undefined || newPrice < 0) {
            toast.error("Preço inválido");
            return;
        }

        try {
            await fetch(`/api/shopping-list/${listId}/product/${productId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ unitPrice: newPrice }),
            });

            toast.success("Preço atualizado");
            setEditingId(null);
            loadList();
        } catch (_error) {
            toast.error("Erro ao atualizar");
        }
    };

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        try {
            await fetch(`/api/shopping-list/${listId}`, {
                method: "DELETE",
            });

            toast.success("Compra excluída com sucesso");
            router.push("/history");
        } catch (_error) {
            toast.error("Erro ao excluir compra");
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const handleExport = async () => {
        if (!list) return;
        try {
            const result = await exportSingleList(listId);
            if (result.success && result.data) {
                const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                const dateStr = format(new Date(list.date), "yyyy-MM-dd");
                a.download = `compra-${list.name || "sem-nome"}-${dateStr}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                toast.success("Compra exportada com sucesso");
            } else {
                toast.error(result.error || "Erro ao exportar");
            }
        } catch (error) {
            toast.error("Erro ao exportar dados");
        }
    };

    const handleReopen = async () => {
        if (!list) return;
        try {
            await reopenShoppingList(listId);
            toast.success("Lista reaberta com sucesso! Redirecionando...");
            setTimeout(() => {
                router.push("/list");
            }, 1000);
        } catch (error: any) {
            console.error("Error reopening list:", error);
            toast.error(error.message || "Erro ao reabrir lista");
        }
    };

    const handleAddProduct = async () => {
        const { name, quantity, unitPrice } = newProduct;

        if (!name.trim() || !quantity) {
            toast.error("Nome e quantidade são obrigatórios");
            return;
        }

        const qty = parseInt(quantity);
        const price = unitPrice;

        if (isNaN(qty) || qty <= 0) {
            toast.error("Quantidade deve ser um número positivo");
            return;
        }

        if (price !== null && (isNaN(price) || price < 0)) {
            toast.error("Preço deve ser um número válido");
            return;
        }

        try {
            await fetch(`/api/shopping-list/${listId}/product`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: name.trim(),
                    quantity: qty,
                    unitPrice: price,
                    category: newProduct.category,
                }),
            });

            toast.success("Produto adicionado");
            setAddProductDialogOpen(false);
            setNewProduct({ name: "", quantity: "", unitPrice: 0, category: "Outros" });
            loadList();
        } catch (_error) {
            toast.error("Erro ao adicionar produto");
        }
    };

    const handleRemoveProduct = async (productId: string, productName: string) => {
        try {
            await fetch(`/api/shopping-list/${listId}/product/${productId}`, {
                method: "DELETE",
            });

            toast.success("Produto removido");
            loadList();
        } catch (_error) {
            toast.error("Erro ao remover produto");
        }
    };

    const startEditingDate = () => {
        if (!list) return;
        setTempDate(new Date(list.date).toISOString().split('T')[0]);
        setIsEditingDate(true);
    };

    const startEditingCreatedAt = () => {
        if (!list) return;
        setTempCreatedAt(new Date(list.createdAt).toISOString().split('T')[0]);
        setIsEditingCreatedAt(true);
    };

    const startEditingUpdatedAt = () => {
        if (!list) return;
        setTempUpdatedAt(new Date(list.updatedAt).toISOString().split('T')[0]);
        setIsEditingUpdatedAt(true);
    };

    const handleSaveList = async (updates: { date?: string; name?: string; createdAt?: string; updatedAt?: string }) => {
        try {
            const response = await fetch(`/api/shopping-list/${listId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updates),
            });

            if (!response.ok) throw new Error();

            toast.success("Compra atualizada");
            setIsEditingDate(false);
            setIsEditingName(false);
            setIsEditingCreatedAt(false);
            setIsEditingUpdatedAt(false);
            loadList();
        } catch (_error) {
            toast.error("Erro ao atualizar compra");
        }
    };

    const startEditingName = () => {
        if (!list) return;
        setTempName(list.name || "");
        setIsEditingName(true);
    };

    const groupedProducts = useMemo(() => {
        if (!list) return {};
        return filteredProducts.reduce((acc, product) => {
            const category = product.category || "Outros";
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {} as Record<string, Product[]>);
    }, [list, filteredProducts]);

    const categories = Object.keys(groupedProducts).sort();

    if (loading) {
        return (
            <div className="container p-4 pb-24 space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-24" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-10 w-32" />
                    </CardContent>
                </Card>
                <div className="space-y-6">
                    {[1, 2].map(i => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="h-4 w-20 ml-2" />
                            {[1, 2, 3].map(j => (
                                <Skeleton key={j} className="h-24 w-full rounded-xl" />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!list) {
        return (
            <div className="p-8 text-center animate-in fade-in zoom-in-95 duration-300">
                <h2 className="text-xl font-semibold mb-2">Lista não encontrada</h2>
                <Button variant="outline" size="icon" onClick={() => router.push("/history")} title="Voltar para o Histórico">
                    <ArrowLeft className="h-4 w-4" />
                </Button>
            </div>
        );
    }

    return (
        <div className="container p-4 pb-24 space-y-6 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="flex-1">
                        {isEditingName ? (
                            <div className="flex items-center gap-2">
                                <Input
                                    value={tempName}
                                    onChange={(e) => setTempName(e.target.value)}
                                    className="h-9 font-bold text-xl uppercase"
                                    placeholder="Nome da Compra"
                                />
                                <Button size="sm" variant="ghost" onClick={() => handleSaveList({ name: tempName })}>
                                    <Save className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsEditingName(false)}>
                                    <X className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        ) : (
                            <h1
                                className="text-2xl font-bold uppercase cursor-pointer hover:text-primary transition-colors flex items-center gap-2 group"
                                onClick={startEditingName}
                            >
                                {list.name || "Compra"}
                                <Edit2 className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h1>
                        )}
                        {isEditingDate ? (
                            <div className="flex items-center gap-2 mt-1">
                                <Input
                                    type="date"
                                    value={tempDate}
                                    onChange={(e) => setTempDate(e.target.value)}
                                    className="h-8 w-40 text-sm"
                                />
                                <Button size="sm" variant="ghost" onClick={() => handleSaveList({ date: tempDate })}>
                                    <Save className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setIsEditingDate(false)}>
                                    <X className="h-4 w-4 text-red-600" />
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mt-1 group cursor-pointer" onClick={startEditingDate}>
                                <p className="text-sm text-muted-foreground">
                                    {format(new Date(list.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                                <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-2">
                    <Dialog open={addProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
                        <DialogTrigger asChild>
                            <Button variant="default" size="icon" title="Adicionar produto">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Adicionar Produto</DialogTitle>
                                <DialogDescription>
                                    Adicione um novo produto a esta compra.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="product-name">Nome do Produto</Label>
                                    <Input
                                        id="product-name"
                                        value={newProduct.name}
                                        onChange={(e) => {
                                            const name = e.target.value;
                                            const category = determineCategoryName(name);
                                            setNewProduct(prev => ({ ...prev, name, category }));
                                        }}
                                        placeholder="Ex: Arroz, Feijão..."
                                        spellCheck="true"
                                        autoCorrect="on"
                                        autoCapitalize="sentences"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="product-quantity">Quantidade</Label>
                                        <Input
                                            id="product-quantity"
                                            type="number"
                                            value={newProduct.quantity}
                                            onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: e.target.value }))}
                                            onFocus={(e) => (e.target as HTMLInputElement).select()}
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="product-price">Valor Unitário (R$)</Label>
                                        <CurrencyInput
                                            id="product-price"
                                            value={newProduct.unitPrice}
                                            onValueChange={(val) => setNewProduct(prev => ({ ...prev, unitPrice: val }))}
                                            onFocus={(e) => (e.target as HTMLInputElement).select()}
                                            placeholder="0,00"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="product-category">Categoria</Label>
                                    <Input
                                        id="product-category"
                                        value={newProduct.category}
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                                        placeholder="Ex: Mercearia, Limpeza..."
                                        spellCheck="true"
                                        autoCorrect="on"
                                        autoCapitalize="sentences"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setAddProductDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleAddProduct}>
                                    Adicionar Produto
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleReopen}
                        title="Reabrir esta lista (criar cópia)"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleExport}
                        title="Exportar compra"
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="destructive"
                        size="icon"
                        onClick={handleDeleteClick}
                        title="Excluir compra"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Total Gasto</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(list.total)}</p>
                </CardContent>
            </Card>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Buscar produto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
            </div>

            <div className="space-y-6">
                {categories.map((category) => (
                    <div key={category} className="space-y-3">
                        <div className="flex items-center gap-2 ml-2">
                            <div className="h-4 w-1 bg-primary rounded-full" />
                            <h3 className="font-black text-muted-foreground uppercase text-[10px] tracking-[0.2em]">
                                {category}
                            </h3>
                        </div>
                        {groupedProducts[category].map((product) => (
                            <HistoryItem
                                key={product.id}
                                product={product}
                                listId={listId}
                                onRefresh={loadList}
                                onRemove={() => handleRemoveProduct(product.id, product.name)}
                            />
                        ))}
                    </div>
                ))}

                {list.products.length > 0 && filteredProducts.length === 0 && (
                    <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed">
                        <p className="text-muted-foreground font-medium italic">Nenhum produto encontrado na busca.</p>
                    </div>
                )}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent className="rounded-3xl border-2 shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-black text-2xl uppercase tracking-tight">Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription className="text-base font-medium">
                            Tem certeza que deseja excluir esta compra? Esta ação NÃO pode ser desfeita e todos os dados serão perdidos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="gap-2">
                        <AlertDialogCancel className="rounded-xl font-bold uppercase tracking-widest text-[10px] h-11">Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600 rounded-xl font-black uppercase tracking-widest text-[10px] h-11"
                        >
                            Excluir Compra
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function HistoryItem({
    product,
    listId,
    onRefresh,
    onRemove
}: {
    product: Product;
    listId: string;
    onRefresh: () => void;
    onRemove: () => void;
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [unitPrice, setUnitPrice] = useState<number>(product.unitPrice || 0);
    const [quantity, setQuantity] = useState<string>(product.quantity.toString());
    const [total, setTotal] = useState<number>(product.totalPrice || 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setUnitPrice(product.unitPrice || 0);
        setQuantity(product.quantity.toString());
        setTotal(product.totalPrice || 0);
    }, [product]);

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
        if (!isNaN(numQty)) {
            setTotal(numQty * unitPrice);
        }
    };

    const handleSave = async () => {
        const numQty = parseInt(quantity);
        if (isNaN(numQty) || numQty <= 0) {
            toast.error("Quantidade inválida");
            return;
        }

        setLoading(true);
        try {
            // Primeiro atualiza o preço se necessário (usando a lógica da API do histórico)
            await fetch(`/api/shopping-list/${listId}/product/${product.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    unitPrice: unitPrice,
                    quantity: numQty
                }),
            });

            toast.success("Produto atualizado");
            setIsEditing(false);
            onRefresh();
        } catch (_error) {
            toast.error("Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    const hasNoPrice = !unitPrice || unitPrice === 0;

    return (
        <Card
            className={`relative overflow-hidden transition-all duration-300 border-l-4 ${isEditing ? 'ring-2 ring-primary/20 shadow-md scale-[1.02]' : 'shadow-sm'
                } ${hasNoPrice ? 'border-l-amber-500 bg-amber-50/5' : 'border-l-green-500 bg-card shadow-sm'
                }`}
        >
            <div className="p-4 space-y-4">
                {/* Cabeçalho - CLIQUE AQUI PARA EXPANDIR */}
                <div
                    className="flex justify-between items-start gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className={`font-black tracking-tight transition-all ${isEditing ? 'text-lg' : 'text-base'}`}>
                                {product.name}
                            </h3>
                            {!isEditing && (
                                <span className="text-[10px] font-bold text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {quantity} UN
                                </span>
                            )}
                        </div>
                        {product.category && (
                            <div className="flex flex-wrap gap-2 items-center">
                                <span className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground font-bold border capitalize">
                                    {product.category}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="text-right shrink-0">
                        <div className={`font-black tabular-nums transition-all ${isEditing ? 'text-2xl' : 'text-lg'} ${hasNoPrice ? 'text-amber-600' : 'text-green-600'}`}>
                            {hasNoPrice ? "R$ ---" : formatCurrency(total)}
                        </div>
                        {!isEditing && !hasNoPrice && (
                            <div className="text-[10px] font-bold text-muted-foreground uppercase">
                                {formatCurrency(unitPrice)} / un
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="animate-in slide-in-from-top-2 duration-300 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-dashed">
                            {/* Coluna Quantidade */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Quantidade</Label>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => handleQtyChange(e.target.value)}
                                    onFocus={(e) => e.target.select()}
                                    disabled={loading}
                                    className="h-12 text-xl font-bold bg-muted/30 border-2 focus:border-primary transition-all"
                                />
                            </div>

                            {/* Coluna Preço Unitário */}
                            <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Preço Unitário</Label>
                                <CurrencyInput
                                    placeholder="0,00"
                                    value={unitPrice}
                                    onValueChange={handlePriceChange}
                                    onFocus={(e) => e.target.select()}
                                    disabled={loading}
                                    className="h-12 text-xl font-bold bg-muted/30 border-2 focus:border-primary transition-all flex-1"
                                />
                            </div>
                        </div>

                        {/* Rodapé do Card */}
                        <div className="flex items-center justify-between pt-2 border-t">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-10 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 px-3 flex gap-2 items-center"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (confirm(`Remover ${product.name.toUpperCase()}?`)) {
                                        onRemove();
                                    }
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="text-xs font-black uppercase">Remover</span>
                            </Button>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-10 px-4 font-bold"
                                    onClick={() => setIsEditing(false)}
                                >
                                    CANCELAR
                                </Button>
                                <Button
                                    size="sm"
                                    className="h-10 px-6 font-black bg-green-600 hover:bg-green-700 text-white"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    SALVAR
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
}
