"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteListAsAdmin } from "@/app/actions/admin";
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

export function AdminDeleteListButton({ listId, listName, userName }: { listId: string, listName: string | null, userName: string | null }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        try {
            const result = await deleteListAsAdmin(listId);
            if (result.success) {
                toast.success("Lista excluída pelo Admin.");
                setOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Erro ao excluir.");
            }
        } catch (error: any) {
            toast.error("Erro inesperado.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-destructive/10 hover:text-destructive h-8 w-8"
                    onClick={(e) => e.stopPropagation()} // Prevent card click
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Lista de {userName}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Você está prestes a excluir a lista <strong>{listName || "Sem Nome"}</strong> do usuário <strong>{userName}</strong>.
                        <br /><br />
                        Esta ação é irreversível.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading} onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground font-bold"
                    >
                        {loading ? "Excluindo..." : "Confirmar Exclusão"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
