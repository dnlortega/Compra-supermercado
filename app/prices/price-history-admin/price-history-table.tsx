"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatCurrency } from "@/lib/utils";
import { Trash2, Edit } from "lucide-react";

interface PriceEntry {
    id: string;
    productName: string;
    unitPrice: number;
    purchaseDate: string | Date;
}

export default function PriceHistoryTable({ entries, onEdit, onDelete }: {
    entries: PriceEntry[];
    onEdit: (entry: PriceEntry) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Produto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead style={{ width: 1 }}>Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {entries.map((e) => (
                    <TableRow key={e.id}>
                        <TableCell className="max-w-xs truncate">{e.productName}</TableCell>
                        <TableCell>{formatCurrency(e.unitPrice)}</TableCell>
                        <TableCell>{format(new Date(e.purchaseDate), "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => onEdit(e)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => onDelete(e.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
