"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowDownCircle } from "lucide-react";
import { toast } from "sonner";

export default function ImportOpenListButton() {
    const handleClick = async () => {
        try {
            const res = await fetch('/api/import-open-list', { method: 'POST' });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data?.error || 'Falha ao importar');
                return;
            }
            const created = data?.result?.created ?? 0;
            toast.success(`Importados ${created} registros`);
        } catch (err) {
            console.error(err);
            toast.error('Erro ao importar para histórico');
        }
    };

    return (
        <Button variant="outline" size="sm" onClick={handleClick}>
            <ArrowDownCircle className="h-4 w-4 mr-2" /> Copiar para Histórico
        </Button>
    );
}
