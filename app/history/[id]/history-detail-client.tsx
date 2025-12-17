"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Edit2, Save, X, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
}

export default function HistoryDetailClient({ listId }: { listId: string }) {
    const router = useRouter();
    const [list, setList] = useState<ShoppingListDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editPrice, setEditPrice] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    useEffect(() => {
        loadList();
    }, [listId]);

    const loadList = async () => {
        try {
            const response = await fetch(`/api/shopping-list/${listId}`);
            const data = await response.json();
            setList(data);
        } catch (error) {
            toast.error("Erro ao carregar detalhes");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingId(product.id);
        setEditPrice(product.unitPrice?.toString() || "");
    };

    const handleSave = async (productId: string, quantity: number) => {
        const newPrice = parseFloat(editPrice);
        if (isNaN(newPrice)) {
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
        } catch (error) {
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
        } catch (error) {
            toast.error("Erro ao excluir compra");
        } finally {
            setDeleteDialogOpen(false);
        }
    };

    const groupedProducts = list?.products.reduce((acc, product) => {
        const category = product.category || "Outros";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>) || {};

    const categories = Object.keys(groupedProducts).sort();

    if (loading) {
        return <div className="p-8 text-center">Carregando...</div>;
    }

    if (!list) {
        return <div className="p-8 text-center">Lista não encontrada</div>;
    }

    return (
        <div className="container p-4 pb-24 space-y-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{list.name || "Compra"}</h1>
                        <p className="text-sm text-muted-foreground">
                            {format(new Date(list.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </p>
                    </div>
                </div>
                <Button
                    variant="destructive"
                    size="icon"
                    onClick={handleDeleteClick}
                    title="Excluir compra"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
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
                            <Card key={product.id}>
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold">{product.name}</h4>
                                            <p className="text-sm text-muted-foreground">Qtd: {product.quantity}</p>
                                        </div>
                                        <div className="text-right space-y-1">
                                            {editingId === product.id ? (
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={editPrice}
                                                        onChange={(e) => setEditPrice(e.target.value)}
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
