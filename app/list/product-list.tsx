"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CreatedEntriesModal from "@/components/created-entries-modal";
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

interface Product {
    id: string;
    name: string;
    quantity: number;
    category?: string;
}

export default function ProductList({ initialProducts }: { initialProducts: Product[] }) {
    const groupedProducts = initialProducts.reduce((acc, product) => {
        const category = product.category || "Outros";
        if (!acc[category]) acc[category] = [];
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    const categories = Object.keys(groupedProducts).sort();

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
    const [modalOpen, setModalOpen] = useState(false);
    const [createdEntries, setCreatedEntries] = useState<any[]>([]);

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
                window.location.reload();
            } else {
                toast.error(data?.error || "Erro ao remover produto");
                setDeleteDialogOpen(true); // Reopen dialog if error
                setLoading(false);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            toast.error("Erro ao remover produto");
            setDeleteDialogOpen(true); // Reopen dialog if error
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateProduct(product.id, { name: editName, quantity: editQty });
            toast.success("Produto atualizado");
            setIsEditing(false);
            window.location.reload();
        } catch {
            toast.error("Erro ao atualizar");
            setLoading(false);
        }
    };

    const increment = async () => {
        try {
            await updateProduct(product.id, { quantity: product.quantity + 1 });
            window.location.reload();
        } catch { }
    }

    const decrement = async () => {
        if (product.quantity <= 1) return;
        try {
            await updateProduct(product.id, { quantity: product.quantity - 1 });
            window.location.reload();
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

                    <Button variant="ghost" size="icon" onClick={async () => {
                        try {
                            const res = await fetch(`/api/copy-product/${product.id}`, { method: 'POST' });
                            const data = await res.json();
                            if (!res.ok) {
                                toast.error(data?.error || 'Erro ao copiar para histórico');
                                return;
                            }
                            // API returns created entry
                            const entry = data?.result;
                            if (entry) {
                                setCreatedEntries([entry]);
                                setModalOpen(true);
                            }
                            toast.success('Copiado para histórico');
                        } catch (e) {
                            console.error(e);
                            toast.error('Erro ao copiar para histórico');
                        }
                    }} title="Copiar para histórico">
                        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M12 3v4m5 4v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6" />
                        </svg>
                    </Button>

                    <Button variant="ghost" size="icon" onClick={handleDeleteClick} disabled={loading}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>
                <CreatedEntriesModal open={modalOpen} entries={createdEntries} onOpenChange={setModalOpen} />

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
