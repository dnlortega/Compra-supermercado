"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ErrorStackModal({ open, stack, onOpenChange }: { open: boolean; stack?: string | null; onOpenChange: (v: boolean) => void; }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Erro do servidor</DialogTitle>
                </DialogHeader>

                <div className="mt-2">
                    <pre className="text-xs whitespace-pre-wrap max-h-64 overflow-y-auto bg-muted p-2 rounded">{stack || 'Sem detalhes'}</pre>
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
