"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ShoppingListsTable from "./shopping-lists-table";
import ShoppingListForm from "./shopping-list-form";
import { listShoppingLists, createShoppingList, updateShoppingList, deleteShoppingList } from "@/app/actions/shopping-lists";
import { toast } from "sonner";

export default function ShoppingListsAdminPage() {
    const [lists, setLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<any | null>(null);
    const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

    const load = async () => {
        setLoading(true);
        try {
            const data = await listShoppingLists({ status: filterStatus, take: 500 });
            setLists(data || []);
        } catch (e) {
            console.error(e);
            toast.error("Erro ao carregar listas");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { void load(); }, [filterStatus]);

    const handleDelete = async (id: string) => {
        if (!confirm('Confirma exclusão desta lista?')) return;
        try {
            await deleteShoppingList(id);
            toast.success('Lista removida');
            await load();
        } catch (e) {
            console.error(e);
            toast.error('Erro ao remover lista');
        }
    };

    const handleEdit = (list: any) => { setEditing(list); setShowForm(true); };
    const handleCreate = () => { setEditing(null); setShowForm(true); };

    const handleSubmit = async (data: { id?: string; name?: string; date?: string; status?: string }) => {
        try {
            if (data.id) {
                await updateShoppingList(data.id, { name: data.name, date: data.date ? new Date(`${data.date}T12:00:00Z`) : undefined, status: data.status });
                toast.success('Lista atualizada');
            } else {
                await createShoppingList({ name: data.name, date: data.date ? new Date(`${data.date}T12:00:00Z`) : undefined, status: data.status });
                toast.success('Lista criada');
            }
            setShowForm(false);
            await load();
        } catch (e) {
            console.error(e);
            toast.error('Erro ao salvar lista');
        }
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Painel de Controle - Listas de Compra</h2>
                <div className="flex items-center gap-2">
                    <select className="input" value={filterStatus || ''} onChange={(e) => setFilterStatus(e.target.value || undefined)}>
                        <option value="">Todos</option>
                        <option value="OPEN">OPEN</option>
                        <option value="FINISHED">FINISHED</option>
                    </select>
                    <Button onClick={handleCreate}>Nova Lista</Button>
                    <Button variant="ghost" onClick={load}>Atualizar</Button>
                </div>
            </div>

            <Card className="p-4">
                {showForm ? (
                    <ShoppingListForm initial={editing ? { id: editing.id, name: editing.name, date: editing.date, status: editing.status } : undefined} onCancel={() => setShowForm(false)} onSubmit={handleSubmit} />
                ) : (
                    <div>
                        <ShoppingListsTable lists={lists} onEdit={handleEdit} onDelete={handleDelete} />
                        {lists.length === 0 && !loading && <p className="text-sm text-muted-foreground mt-4">Nenhuma lista encontrada.</p>}
                    </div>
                )}
            </Card>
        </div>
    );
}
