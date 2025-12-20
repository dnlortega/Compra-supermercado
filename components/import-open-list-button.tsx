"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";
import CreatedEntriesModal from "./created-entries-modal";

export default function ImportOpenListButton() {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [entries, setEntries] = useState<Array<any>>([]);

    const handleClick = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/import-open-list', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data?.error || 'Falha ao importar');
                return;
            }
            const created = data?.result?.created ?? 0;
            const createdEntries = data?.result?.entries ?? [];
            setEntries(createdEntries);
            setOpen(true);
            toast.success(`Importados ${created} registros`);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao importar para histórico');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
                <ArrowDownCircle className="h-4 w-4 mr-2" /> Copiar para Histórico
            </Button>
            <CreatedEntriesModal open={open} entries={entries} onOpenChange={setOpen} />
        </>
    );
}
