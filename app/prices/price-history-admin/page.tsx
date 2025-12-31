"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PriceHistoryTable from "./price-history-table";
import PriceHistoryForm from "./price-history-form";
import { listPriceHistory, deletePriceHistoryEntry, createPriceHistoryEntry, updatePriceHistoryEntry, deleteZeroValueHistoryEntries } from "@/app/actions/price-history";
import { toast } from "sonner";
import ImportFileToPriceHistoryButton from "@/components/import-file-to-price-history-button";
import { Trash2, Plus, RefreshCw, TrendingUp } from "lucide-react";

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
            // Map the data to include productName from catalogProduct
            const mappedEntries = (data || []).map((entry: any) => ({
                id: entry.id,
                productName: entry.catalogProduct?.name || 'Produto sem nome',
                unitPrice: entry.unitPrice,
                purchaseDate: entry.purchaseDate,
            }));
            setEntries(mappedEntries);
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

    const handleDeleteZeroValues = async () => {
        if (!confirm("Tem certeza que deseja remover todos os registros com valor 0 ou nulo?")) return;
        setLoading(true);
        try {
            const result = await deleteZeroValueHistoryEntries();
            toast.success(`${result.count} registros removidos.`);
            await load();
        } catch (e) {
            console.error(e);
            toast.error("Erro ao limpar registros zerados");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <span className="sr-only">Painel de Controle - Histórico de Preços</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <input
                        className="input flex-1 sm:flex-initial sm:w-48"
                        placeholder="Filtrar produto"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />

                    <Button
                        size="icon"
                        onClick={handleCreate}
                        title="Adicionar novo registro"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleDeleteZeroValues}
                        title="Limpar registros com valor zero"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>

                    <ImportFileToPriceHistoryButton />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={load}
                        title="Atualizar lista"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
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
