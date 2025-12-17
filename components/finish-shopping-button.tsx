"use client";

import { finishShoppingList } from "@/app/actions/finish-shopping";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CheckCheck } from "lucide-react";

export function FinishShoppingButton({ disabled }: { disabled: boolean }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFinish = async () => {
        setLoading(true);
        try {
            await finishShoppingList();
            toast.success("Compra finalizada e salva no histórico!");
            router.push("/history");
        } catch (error) {
            toast.error("Erro ao finalizar compra");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            className="w-full mt-6"
            size="lg"
            onClick={handleFinish}
            disabled={disabled || loading}
        >
            <CheckCheck className="mr-2 h-4 w-4" />
            {loading ? "Finalizando..." : "Finalizar Compra"}
        </Button>
    );
}
