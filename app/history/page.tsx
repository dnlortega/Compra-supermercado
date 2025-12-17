"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Calendar, ChevronDown, ChevronUp, ChevronRight, Trash2 } from "lucide-react";
import { getHistory } from "@/app/actions/history";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type HistoryItem = {
    month: string;
    lists: {
        id: string;
        date: Date;
        total: number;
        itemCount: number;
        name: string | null;
    }[];
};

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedMonths, setExpandedMonths] = useState<Record<string, boolean>>({});
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [listToDelete, setListToDelete] = useState<string | null>(null);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        try {
            const data = await getHistory();
            setHistory(data);
            if (data.length > 0) {
                setExpandedMonths({ [data[0].month]: true });
            }
        } catch (_e) {
            console.error("Failed to load history", _e);
        } finally {
            setLoading(false);
        }
    };

    const toggleMonth = (month: string) => {
        setExpandedMonths(prev => ({ ...prev, [month]: !prev[month] }));
    };

    const handleDeleteClick = (listId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setListToDelete(listId);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
        if (!listToDelete) return;

        try {
            await fetch(`/api/shopping-list/${listToDelete}`, {
                method: "DELETE",
            });

            toast.success("Compra excluída");
            loadHistory();
        } catch (_error) {
            toast.error("Erro ao excluir");
        } finally {
            setDeleteDialogOpen(false);
            setListToDelete(null);
        }
    };

    if (loading) return <div className="p-8 text-center">Carregando histórico...</div>;

    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 p-4 text-center text-muted-foreground">
                <ShoppingBag className="h-12 w-12 opacity-50" />
                <p>Nenhum histórico de compras encontrado.</p>
                <p className="text-sm">Finalize uma lista para vê-la aqui.</p>
            </div>
        );
    }

    return (
        <div className="container p-4 pb-24 space-y-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold">Histórico de Compras</h1>

            <div className="space-y-4">
                {history.map((group) => (
                    <div key={group.month} className="space-y-2">
                        <Button
                            variant="ghost"
                            className="w-full flex items-center justify-between p-2 hover:bg-muted/50"
                            onClick={() => toggleMonth(group.month)}
                        >
                            <h2 className="text-lg font-semibold capitalize flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                {group.month}
                            </h2>
                            {expandedMonths[group.month] ? (
                                <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                        </Button>

                        {expandedMonths[group.month] && (
                            <div className="grid gap-3">
                                {group.lists.map((list) => (
                                    <div key={list.id} className="relative group">
                                        <Link href={`/history/${list.id}`}>
                                            <Card className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer">
                                                <CardContent className="p-4 flex items-center justify-between">
                                                    <div className="space-y-1 flex-1">
                                                        <div className="font-medium flex items-center gap-2">
                                                            {list.name || "Compra"}
                                                            <Badge variant="outline" className="text-xs font-normal">
                                                                {format(new Date(list.date), "dd 'de' MMMM", {
                                                                    locale: ptBR,
                                                                })}
                                                            </Badge>
                                                        </div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {list.itemCount} itens
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-right">
                                                            <div className="font-bold text-lg text-primary">
                                                                {new Intl.NumberFormat("pt-BR", {
                                                                    style: "currency",
                                                                    currency: "BRL",
                                                                }).format(list.total)}
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                            onClick={(e) => handleDeleteClick(list.id, e)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                        <AlertDialogDescription>
                            Tem certeza que deseja excluir esta compra? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Excluir
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
