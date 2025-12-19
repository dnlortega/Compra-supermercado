"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CurrencyInput } from "@/components/ui/currency-input";

export default function PriceHistoryForm({
    initial,
    onCancel,
    onSubmit,
}: {
    initial?: { id?: string; productName?: string; unitPrice?: number; purchaseDate?: string };
    onCancel: () => void;
    onSubmit: (data: { id?: string; productName: string; unitPrice: number; purchaseDate?: string }) => Promise<void>;
}) {
    const [productName, setProductName] = useState(initial?.productName || "");
    const [unitPrice, setUnitPrice] = useState<number>(initial?.unitPrice ?? 0);
    const [purchaseDate, setPurchaseDate] = useState<string>(() => {
        if (initial?.purchaseDate) return new Date(initial.purchaseDate).toISOString().split("T")[0];
        return new Date().toISOString().split("T")[0];
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initial) {
            setProductName(initial.productName || "");
            setUnitPrice(initial.unitPrice ?? 0);
            setPurchaseDate(initial.purchaseDate ? new Date(initial.purchaseDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0]);
        }
    }, [initial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productName) return;
        setLoading(true);
        try {
            await onSubmit({ id: initial?.id, productName: productName.trim(), unitPrice, purchaseDate });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <Label>Produto</Label>
                <Input value={productName} onChange={(e) => setProductName(e.target.value)} />
            </div>
            <div>
                <Label>Valor Unitário</Label>
                <CurrencyInput value={unitPrice} onValueChange={(v) => setUnitPrice(v)} />
            </div>
            <div>
                <Label>Data da Compra</Label>
                <Input type="date" value={purchaseDate} onChange={(e) => setPurchaseDate(e.target.value)} />
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{initial ? 'Salvar' : 'Adicionar'}</Button>
                <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
            </div>
        </form>
    );
}
