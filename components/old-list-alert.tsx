"use client";

import { useState } from "react";
import { AlertCircle, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteShoppingList, updateShoppingList } from "@/app/actions/shopping-lists";
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
} from "@/components/ui/alert-dialog";

interface OldListAlertProps {
    listId: string;
    daysOpen: number;
}

export function OldListAlert({ listId, daysOpen }: OldListAlertProps) {
    const [openDialog, setOpenDialog] = useState(false);
    const [action, setAction] = useState<"delete" | "keep" | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleAction = async () => {
        if (!action) return;
        setLoading(true);

        try {
            if (action === "delete") {
                await deleteShoppingList(listId);
                toast.success("Lista antiga excluída com sucesso.");
            } else {
                // "Manter" - renew date to today so prompt doesn't show again immediately
                await updateShoppingList(listId, { date: new Date() });
                toast.success("Data da lista atualizada para hoje.");
            }
            router.refresh();
        } catch (error) {
            toast.error("Erro ao processar ação.");
        } finally {
            setLoading(false);
            setOpenDialog(false);
        }
    };

    const triggerAction = (act: "delete" | "keep") => {
        setAction(act);
        setOpenDialog(true);
    };

    return (
        <>
            <Card className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/50 animate-in slide-in-from-top-4 mb-4">
                <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 dark:bg-red-900/40 p-2 rounded-full">
                            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="font-bold text-red-900 dark:text-red-200">
                                Lista Aberta há {daysOpen} dias
                            </p>
                            <p className="text-sm text-red-700 dark:text-red-300">
                                Esta lista não foi finalizada. Deseja excluí-la ou continuar?
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1 sm:flex-none"
                            onClick={() => triggerAction("delete")}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Excluir
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 sm:flex-none border-red-200 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-900/50"
                            onClick={() => triggerAction("keep")}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Manter
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={openDialog} onOpenChange={setOpenDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {action === "delete" ? "Excluir Lista Antiga?" : "Manter Lista Atual?"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {action === "delete"
                                ? "Tem certeza que deseja apagar esta lista? Todos os itens adicionados serão perdidos."
                                : "Ao manter a lista, a data será atualizada para hoje e você poderá continuar editando-a."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={loading}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                handleAction();
                            }}
                            className={action === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                            disabled={loading}
                        >
                            {loading ? "Processando..." : (action === "delete" ? "Sim, Excluir" : "Sim, Manter")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
