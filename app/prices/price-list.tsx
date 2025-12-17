"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { updateProduct } from "@/app/actions/products";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

interface Product {
    id: string;
    name: string;
    quantity: number;
    unitPrice: number | null;
    totalPrice: number | null;
    checked: boolean;
}

export default function PriceList({ initialProducts }: { initialProducts: Product[] }) {
    return (
        <div className="space-y-4">
            {initialProducts.map((product) => (
                <PriceItem key={product.id} product={product} />
            ))}
            {initialProducts.length === 0 && (
                <p className="text-center text-muted-foreground p-8">Sua lista está vazia.</p>
            )}
        </div>
    );
}

function PriceItem({ product }: { product: Product }) {
    const [unitPrice, setUnitPrice] = useState<string>(product.unitPrice?.toString() || "");
    const [total, setTotal] = useState<number>(product.totalPrice || 0);
    const [loading, setLoading] = useState(false);

    const handleBlur = async () => {
        if (!unitPrice) return;
        const val = parseFloat(unitPrice.replace(",", "."));
        if (isNaN(val)) return;
        if (val === product.unitPrice) return;

        setLoading(true);
        try {
            await updateProduct(product.id, { unitPrice: val });
            setTotal(val * product.quantity);
            toast.success("Preço salvo");
        } catch {
            toast.error("Erro ao salvar");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (val: string) => {
        setUnitPrice(val);
        const num = parseFloat(val.replace(",", "."));
        if (!isNaN(num)) {
            setTotal(num * product.quantity);
        }
    };

    return (
        <Card className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">Qtd: {product.quantity}</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-green-600">{formatCurrency(total)}</p>
                </div>
            </div>

            <div className="mt-2">
                <label className="text-xs font-medium text-muted-foreground">Valor Unitário</label>
                <div className="flex gap-2 items-center">
                    <span className="text-muted-foreground">R$</span>
                    <Input
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={unitPrice}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        disabled={loading}
                        className="text-lg"
                    />
                </div>
            </div>
        </Card>
    );
}
