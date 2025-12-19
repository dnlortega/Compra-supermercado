"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ShoppingListForm({ initial, onCancel, onSubmit }: {
    initial?: { id?: string; name?: string; date?: string; status?: string };
    onCancel: () => void;
    onSubmit: (data: { id?: string; name?: string; date?: string; status?: string }) => Promise<void>;
}) {
    const [name, setName] = useState(initial?.name || "");
    const [date, setDate] = useState(initial?.date ? new Date(initial.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState(initial?.status || "OPEN");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initial) {
            setName(initial.name || "");
            setDate(initial.date ? new Date(initial.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
            setStatus(initial.status || 'OPEN');
        }
    }, [initial]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit({ id: initial?.id, name: name.trim(), date, status });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div>
                <Label>Nome</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <Label>Data</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
                <Label>Status</Label>
                <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="OPEN">OPEN</option>
                    <option value="FINISHED">FINISHED</option>
                </select>
            </div>
            <div className="flex gap-2">
                <Button type="submit" disabled={loading}>{initial ? 'Salvar' : 'Criar'}</Button>
                <Button variant="ghost" type="button" onClick={onCancel}>Cancelar</Button>
            </div>
        </form>
    );
}
