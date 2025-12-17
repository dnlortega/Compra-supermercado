"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addProduct } from "@/app/actions/products";
import { toast } from "sonner";
import { Plus } from "lucide-react";

export default function AddProductForm() {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        try {
            await addProduct({ name, quantity });
            setName("");
            setQuantity(1);
            toast.success("Produto adicionado!");
        } catch (error) {
            console.error(error);
            toast.error("Erro ao adicionar produto");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 items-end bg-card p-4 rounded-lg border shadow-sm">
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Produto</label>
                <Input
                    placeholder="Ex: Arroz 5kg"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="w-24 space-y-2">
                <label className="text-sm font-medium">Qtd</label>
                <Input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    disabled={loading}
                />
            </div>
            <Button type="submit" disabled={loading}>
                <Plus className="w-4 h-4 mr-2" />
                Add
            </Button>
        </form>
    );
}
