"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Edit2, Save, X, Trash2, Plus, Download } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { exportSingleList } from "@/app/actions/export-import";
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

    useEffect(() => {
        loadList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [listId]);

    const loadList = async () => {
        try {
            const response = await fetch(`/api/shopping-list/${listId}`);
            const data = await response.json();
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

    const groupedProducts = list?.products.reduce((acc, product) => {
        const category = product.category || "Outros";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>) || {};

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
                <Button onClick={() => router.push("/history")}>Voltar para o Histórico</Button>
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
                                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
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
                                            placeholder="1"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="product-price">Valor Unitário (R$)</Label>
                                        <CurrencyInput
                                            id="product-price"
                                            value={newProduct.unitPrice}
                                            onValueChange={(val) => setNewProduct(prev => ({ ...prev, unitPrice: val }))}
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

            <div className="space-y-6">
                {categories.map((category) => (
                    <div key={category} className="space-y-3">
                        <h3 className="font-semibold text-muted-foreground ml-2 uppercase text-xs tracking-wider">
                            {category}
                        </h3>
                        {groupedProducts[category].map((product) => (
                            <Card key={product.id} className="relative group">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground">Qtd: {product.quantity}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 text-muted-foreground hover:text-destructive"
                                            onClick={() => handleRemoveProduct(product.id, product.name)}
                                            title="Remover produto"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                        <div className="text-right space-y-1">
                                            {editingId === product.id ? (
                                                <div className="flex items-center gap-2">
                                                    <CurrencyInput
                                                        value={editPrice}
                                                        onValueChange={setEditPrice}
                                                        className="w-24 h-8"
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() => handleSave(product.id, product.quantity)}
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        className="h-8 w-8"
                                                        onClick={() => setEditingId(null)}
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-sm text-muted-foreground">
                                                            {product.unitPrice ? formatCurrency(product.unitPrice) : "-"}
                                                        </p>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-6 w-6"
                                                            onClick={() => handleEdit(product)}
                                                        >
                                                            <Edit2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <p className="font-bold">
                                                        {product.totalPrice ? formatCurrency(product.totalPrice) : "-"}
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ))}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita e todos os produtos serão removidos.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
