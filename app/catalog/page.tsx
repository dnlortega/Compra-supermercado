"use client";

import { useState, useEffect } from "react";
import { getAllCatalogProducts, addCatalogProduct, deleteCatalogProduct } from "@/app/actions/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Trash2, Plus, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CatalogPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await getAllCatalogProducts();
            setProducts(data);
        } catch (error) {
            toast.error("Erro ao carregar catálogo");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !category) {
            toast.error("Preencha todos os campos");
            return;
        }

        setSubmitting(true);
        try {
            await addCatalogProduct({ name, category });
            toast.success("Produto adicionado ao catálogo");
            setName("");
            setCategory("");
            loadProducts();
        } catch (error) {
            toast.error("Erro ao adicionar produto");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja remover este produto do catálogo?")) return;

        try {
            await deleteCatalogProduct(id);
            toast.success("Produto removido");
            loadProducts();
        } catch (error) {
            toast.error("Erro ao remover produto");
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl bg-background min-h-screen pb-24">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Gerenciar Catálogo</h1>
            </div>

            <Card className="p-4 mb-6">
                <form onSubmit={handleAdd} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome do Produto</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Ex: Chocolate"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Categoria</Label>
                            <Input
                                id="category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                placeholder="Ex: Doces"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                        Adicionar ao Catálogo
                    </Button>
                </form>
            </Card>

            <div className="space-y-3">
                <h2 className="text-lg font-semibold px-1">Produtos no Catálogo</h2>
                {loading ? (
                    <div className="flex justify-center p-8">
                        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
                    </div>
                ) : products.length === 0 ? (
                    <p className="text-center text-muted-foreground p-8">Catálogo vazio.</p>
                ) : (
                    <div className="grid gap-2">
                        {products.map((product) => (
                            <Card key={product.id} className="p-3 flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDelete(product.id)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
