"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCurrentOpenList } from "@/app/actions/shopping-lists";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function DeleteListButton({ hasItems }: { hasItems: boolean }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        try {
            await deleteCurrentOpenList();
            setOpen(false); // Close dialog immediately to feel faster
            toast.success("Lista excluída com sucesso.");
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || "Erro ao excluir lista.");
            setOpen(false); // Close on error too (or keep open?) keep open usually better but logic was closing.
        } finally {
            setLoading(false);
            // setOpen(false); // Removed from here
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon" title="Excluir Lista Atual">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Lista Atual?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Tem certeza que deseja cancelar esta lista?
                        {hasItems && " Todos os itens adicionados serão perdidos."}
                        <br /><br />
                        Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Voltar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
                    >
                        {loading ? "Excluindo..." : "Sim, Excluir"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
