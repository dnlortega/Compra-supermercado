"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2, Edit } from "lucide-react";

export default function ShoppingListsTable({ lists, onEdit, onDelete }: {
    lists: any[];
    onEdit: (list: any) => void;
    onDelete: (id: string) => void;
}) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Itens</TableHead>
                    <TableHead style={{ width: 1 }}>Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {lists.map((l) => (
                    <TableRow key={l.id}>
                        <TableCell className="max-w-xs truncate">{l.name || 'Lista'}</TableCell>
                        <TableCell>{l.date ? format(new Date(l.date), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
                        <TableCell>{l.status}</TableCell>
                        <TableCell>{(l.products || []).length}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                <Button size="icon" variant="ghost" onClick={() => onEdit(l)}>
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => onDelete(l.id)}>
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
