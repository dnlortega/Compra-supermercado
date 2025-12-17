"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Minus, Plus } from "lucide-react";
import { deleteProduct, updateProduct } from "@/app/actions/products";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Product {
    id: string;
    name: string;
    quantity: number;
}

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
    return (
        <div className="space-y-2">
            {initialProducts.map((product) => (
                <ProductItem key={product.id} product={product} />
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

    const handleDelete = async () => {
        if (!confirm("Tem certeza?")) return;
        setLoading(true);
        try {
            await deleteProduct(product.id);
            toast.success("Produto removido");
        } catch {
            toast.error("Erro ao remover");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateProduct(product.id, { name: editName, quantity: editQty });
            toast.success("Produto atualizado");
            setIsEditing(false);
        } catch {
            toast.error("Erro ao atualizar");
        } finally {
            setLoading(false);
        }
    };

    const increment = async () => {
        try {
            await updateProduct(product.id, { quantity: product.quantity + 1 });
        } catch { }
    }

    const decrement = async () => {
        if (product.quantity <= 1) return;
        try {
            await updateProduct(product.id, { quantity: product.quantity - 1 });
        } catch { }
    }

    return (
        <div className="flex items-center justify-between p-4 bg-card rounded-lg border shadow-sm">
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
                <span className="font-medium text-lg">{product.name}</span>
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
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nome</Label>
                                <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="qty">Quantidade</Label>
                                <Input id="qty" type="number" min={1} value={editQty} onChange={(e) => setEditQty(parseInt(e.target.value))} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsEditing(false)}>Cancelar</Button>
                            <Button onClick={handleUpdate} disabled={loading}>Salvar</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Button variant="ghost" size="icon" onClick={handleDelete} disabled={loading}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
            </div>
        </div>
    );
}
