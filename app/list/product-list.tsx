"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

import { Trash2, Edit2, Minus, Plus } from "lucide-react";
import { updateProduct } from "@/app/actions/products";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    quantity: number;
    category?: string;
}

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
    // Memoizar agrupamento de produtos para evitar recálculos desnecessários
    const { groupedProducts, categories } = useMemo(() => {
        const grouped = initialProducts.reduce((acc, product) => {
            const category = product.category || "Outros";
            if (!acc[category]) acc[category] = [];
            acc[category].push(product);
            return acc;
        }, {} as Record<string, Product[]>);

        return {
            groupedProducts: grouped,
            categories: Object.keys(grouped).sort()
        };
    }, [initialProducts]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {categories.map((category) => (
                <div key={category} className="space-y-2">
                    <h3 className="font-semibold text-muted-foreground ml-2 uppercase text-xs tracking-wider">{category}</h3>
                    {groupedProducts[category].map((product) => (
                        <ProductItem key={product.id} product={product} />
                    ))}
                </div>
            ))}
            {initialProducts.length === 0 && (
                <p className="text-center text-muted-foreground p-8">Sua lista está vazia.</p>
            )}
        </div>
    );
}

function ProductItem({ product }: { product: Product }) {
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState(product.name);
    const [editQty, setEditQty] = useState(product.quantity);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

    const router = useRouter();

    const handleDeleteClick = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        setLoading(true);
        setDeleteDialogOpen(false);
        try {
            const response = await fetch(`/api/product/${product.id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast.success("Produto removido");
                router.refresh();
            } else {
                toast.error(data?.error || "Erro ao remover produto");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Erro ao remover produto");
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateProduct(product.id, { name: editName, quantity: editQty });
            toast.success("Produto atualizado");
            setIsEditing(false);
            router.refresh();
        } catch {
            toast.error("Erro ao atualizar");
            setLoading(false);
        }
    };

    const increment = async () => {
        try {
            await updateProduct(product.id, { quantity: product.quantity + 1 });
            router.refresh();
        } catch { }
    }

    const decrement = async () => {
        if (product.quantity <= 1) return;
        try {
            await updateProduct(product.id, { quantity: product.quantity - 1 });
            router.refresh();
        } catch { }
    }

    return (
        <>
            <div className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={decrement} disabled={loading}>
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center font-bold">{product.quantity}</span>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={increment} disabled={loading}>
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <span className="font-medium text-lg break-words whitespace-normal">{product.name}</span>
                </div>

                <div className="flex gap-2">
                    <Dialog open={isEditing} onOpenChange={setIsEditing}>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" onClick={() => {
                                setEditName(product.name);
                                setEditQty(product.quantity);
                            }}>
                                <Edit2 className="h-4 w-4 text-blue-500" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Editar Produto</DialogTitle>
                                <DialogDescription>
                                    Altere o nome ou a quantidade do produto selecionado.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nome</Label>
                                    <Input
                                        id="name"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        spellCheck="true"
                                        autoCorrect="on"
                                        autoCapitalize="sentences"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="qty">Quantidade</Label>
                                    <Input id="qty" type="number" min={1} value={editQty} onChange={(e) => setEditQty(parseInt(e.target.value))} />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                                <Button onClick={handleUpdate} loading={loading}>Salvar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button variant="ghost" size="icon" onClick={handleDeleteClick} disabled={loading}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja remover '{product.name}' da lista?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Remover
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
