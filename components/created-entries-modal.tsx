"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";

export default function CreatedEntriesModal({ open, entries, onOpenChange }: {
    open: boolean;
    entries: Array<{ id: string; productName: string; unitPrice: number; purchaseDate: string | Date }>;
    onOpenChange: (v: boolean) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Registros Importados</DialogTitle>
                </DialogHeader>

                <div className="mt-2">
                    {entries.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Nenhum registro importado.</p>
                    ) : (
                        <div className="space-y-2 max-h-72 overflow-y-auto">
                            {entries.map((e) => (
                                <div key={e.id} className="flex justify-between items-center border-b pb-2">
                                    <div>
                                        <div className="font-medium">{e.productName}</div>
                                        <div className="text-xs text-muted-foreground">{format(new Date(e.purchaseDate), 'dd/MM/yyyy', { locale: ptBR })}</div>
                                    </div>
                                    <div className="font-semibold">{formatCurrency(e.unitPrice)}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={() => onOpenChange(false)}>Fechar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
