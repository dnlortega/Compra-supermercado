"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ErrorStackModal from "@/components/error-stack-modal";

export default function ImportFileToPriceHistoryButton() {
    const [errorStack, setErrorStack] = useState<string | null>(null);
    const [open, setOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const handleFile = async (file: File | null) => {
        if (!file) return;
        console.log('import-file: selected file', file.name, file.size);
        try {
            const text = await file.text();
            const json = JSON.parse(text);
            const res = await fetch(`/api/import-file-to-price-history`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(json),
            });
            let data: any = null;
            try {
                data = await res.json();
            } catch (parseErr) {
                const text = await res.text();
                data = { text };
            }
            if (!res.ok) {
                console.error('import-file response error', res.status, data);
                const serverMsg = data?.stack || data?.error || data?.text || res.statusText;
                let full = `HTTP ${res.status} - ${String(serverMsg)}`;
                if (res.status === 400) {
                    try {
                        full += "\n\nJSON enviado:\n" + JSON.stringify(json, null, 2);
                        full += "\n\nResposta do servidor:\n" + JSON.stringify(data, null, 2);
                    } catch (e) {
                        // ignore
                    }
                }
                setErrorStack(full);
                setOpen(true);
                toast.error("Erro ao importar (veja detalhes)");
                return;
            }
            const count = Array.isArray(data.created) ? data.created.length : data.createdCount || 0;
            if (count > 0) {
                toast.success(`Importado ${count} registro(s) para Histórico de Preços`);
            } else {
                toast.warning("Nenhum registro foi importado. Verifique se os produtos têm preços válidos.");
            }
            try {
                window.dispatchEvent(new CustomEvent('price-history-imported', { detail: { count } }));
            } catch (e) {
                // ignore in non-browser
            }
        } catch (e: any) {
            console.error(e);
            const stack = e?.stack || e?.message || String(e);
            setErrorStack(String(stack));
            setOpen(true);
            toast.error("Erro ao processar arquivo (veja detalhes)");
        }
    };

    return (
        <>
            <input
                ref={inputRef}
                type="file"
                accept="application/json"
                onChange={(e) => handleFile(e.target.files ? e.target.files[0] : null)}
                className="sr-only"
            />
            <Button variant="outline" onClick={() => inputRef.current?.click()}>Importar JSON</Button>
            <ErrorStackModal open={open} stack={errorStack} onOpenChange={(v) => setOpen(v)} />
        </>
    );
}
