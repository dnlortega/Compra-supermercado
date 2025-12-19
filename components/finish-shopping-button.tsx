"use client";

import { finishShoppingList } from "@/app/actions/finish-shopping";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCheck } from "lucide-react";
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

export function FinishShoppingButton({ disabled }: { disabled: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [errorOpen, setErrorOpen] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);

    const handleFinish = async () => {
        setLoading(true);
        try {
            await finishShoppingList();
            toast.success("Compra finalizada e salva no histórico!");
            router.push("/history");
        } catch (error) {
            // show full error log in dialog instead of generic toast
            const text = error instanceof Error ? `${error.name}: ${error.message}\n\n${error.stack || ""}` : String(error);
            setErrorText(text);
            setErrorOpen(true);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleFinish}
                loading={loading}
                disabled={disabled}
            >
                <CheckCheck className="mr-2 h-4 w-4" />
                Finalizar Compra
            </Button>

            <AlertDialog open={errorOpen} onOpenChange={setErrorOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Erro ao finalizar compra</AlertDialogTitle>
                        <AlertDialogDescription>
                            Ocorreu um erro ao finalizar a compra. Veja o log abaixo para detalhes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="max-h-72 overflow-auto rounded-md bg-surface p-4 text-sm whitespace-pre-wrap font-mono">{errorText}</div>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Fechar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => setErrorOpen(false)}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
