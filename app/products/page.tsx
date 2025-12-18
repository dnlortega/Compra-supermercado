"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCatalogProduct } from "@/app/actions/catalog";
import { toast } from "sonner";
import Link from "next/link";

export default function ProductsPage() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!name.trim()) return;
        setLoading(true);
        try {
            const res = await createCatalogProduct(name.trim(), category || undefined);
            if (res && !res.success) {
                toast.error(res.error || "Erro ao cadastrar produto");
            } else {
                setName("");
                setCategory("");
                toast.success("Produto cadastrado com sucesso");
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro ao cadastrar produto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl bg-background min-h-screen">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/list">Voltar para Lista</Link>
                <h1 className="text-2xl font-bold">Cadastro de Produtos</h1>
            </div>

            <form className="space-y-4 bg-card p-4 rounded-lg border shadow-sm" onSubmit={handleSubmit}>
                <div>
                    <label className="text-sm font-medium">Nome do Produto</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <label className="text-sm font-medium">Categoria (opcional)</label>
                    <Input value={category} onChange={(e) => setCategory(e.target.value)} />
                </div>
                <div className="flex gap-2">
                    <Button type="submit" loading={loading}>Cadastrar</Button>
                    <Link href="/list"><Button variant="outline">Cancelar</Button></Link>
                </div>
            </form>
        </div>
    );
}
