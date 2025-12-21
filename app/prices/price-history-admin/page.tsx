"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PriceHistoryTable from "./price-history-table";
import PriceHistoryForm from "./price-history-form";
import { listPriceHistory, deletePriceHistoryEntry, createPriceHistoryEntry, updatePriceHistoryEntry } from "@/app/actions/price-history";
import { toast } from "sonner";
import ImportFileToPriceHistoryButton from "@/components/import-file-to-price-history-button";

export default function PriceHistoryAdminPage() {
    const [entries, setEntries] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [filter, setFilter] = useState("");

    const load = async () => {
        setLoading(true);
        try {
            const data = await listPriceHistory({ productName: filter, take: 500 });
            setEntries(data || []);
        } catch (e) {
            console.error(e);
            toast.error("Erro ao carregar histórico de preços");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void load(); }, [filter]);

    useEffect(() => {
        const handler = () => { 
            // Use requestAnimationFrame to defer load operation
            requestAnimationFrame(() => {
                void load();
            });
        };
        window.addEventListener('price-history-imported', handler as EventListener);
        return () => window.removeEventListener('price-history-imported', handler as EventListener);
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Confirma remoção deste registro de preço?")) return;
        try {
            await deletePriceHistoryEntry(id);
            toast.success("Registro removido");
            await load();
        } catch (e) {
            console.error(e);
            toast.error("Erro ao remover registro");
        }
    };

    const handleEdit = (entry: any) => {
        setEditing(entry);
        setShowForm(true);
    };

    const handleCreate = () => {
        setEditing(null);
        setShowForm(true);
    };

    const handleSubmit = async (data: { id?: string; productName: string; unitPrice: number; purchaseDate?: string }) => {
        try {
            if (data.id) {
                await updatePriceHistoryEntry(data.id, {
                    productName: data.productName,
                    unitPrice: data.unitPrice,
                    purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
                });
                toast.success("Registro atualizado");
            } else {
                await createPriceHistoryEntry(data.productName, data.unitPrice, data.purchaseDate ? new Date(data.purchaseDate) : undefined);
                toast.success("Registro criado");
            }
            setShowForm(false);
            await load();
        } catch (e) {
            console.error(e);
            toast.error("Erro ao salvar registro");
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Painel de Controle - Histórico de Preços</h2>
                <div className="flex items-center gap-2">
                    <input className="input" placeholder="Filtrar por produto" value={filter} onChange={(e) => setFilter(e.target.value)} />
                    <Button onClick={handleCreate}>Adicionar</Button>
                    <ImportFileToPriceHistoryButton />
                    <Button variant="ghost" onClick={load}>Atualizar</Button>
                </div>
            </div>

            <Card className="p-4">
                {showForm ? (
                    <div>
                        <PriceHistoryForm initial={editing ? { id: editing.id, productName: editing.productName, unitPrice: editing.unitPrice, purchaseDate: editing.purchaseDate } : undefined} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />
                    </div>
                ) : (
                    <div>
                        <PriceHistoryTable entries={entries} onEdit={handleEdit} onDelete={handleDelete} />
                        {entries.length === 0 && !loading && <p className="text-sm text-muted-foreground mt-4">Nenhum registro encontrado.</p>}
                    </div>
                )}
            </Card>
        </div>
    );
}
