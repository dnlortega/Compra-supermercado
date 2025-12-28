"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Edit2, Check, X } from "lucide-react";
import { updateShoppingList } from "@/app/actions/shopping-lists";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function ListNameEditor() {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [listId, setListId] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        loadList();
    }, []);

    const loadList = async () => {
        try {
            const response = await fetch("/api/shopping-list/open");
            if (response.ok) {
                const list = await response.json();
                if (list) {
                    setListId(list.id);
                    setName(list.name || "");
                }
            }
        } catch (error) {
            console.error("Error loading list:", error);
        }
    };

    const handleSave = async () => {
        if (!listId) return;
        setLoading(true);
        try {
            await updateShoppingList(listId, { name: name.trim() || null });
            toast.success("Nome da lista atualizado");
            setIsEditing(false);
            router.refresh();
        } catch (error) {
            console.error("Error updating list name:", error);
            toast.error("Erro ao atualizar nome da lista");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        loadList();
        setIsEditing(false);
    };

    if (!listId) return null;

    return (
        <div className="flex items-center gap-2 mb-4">
            {isEditing ? (
                <div className="flex items-center gap-2 flex-1">
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome da lista (ex: Compra do Mês)"
                        className="flex-1"
                        disabled={loading}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleSave();
                            if (e.key === "Escape") handleCancel();
                        }}
                        autoFocus
                    />
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancel}
                        disabled={loading}
                    >
                        <X className="h-4 w-4 text-red-600" />
                    </Button>
                </div>
            ) : (
                <div className="flex items-center gap-2 flex-1">
                    <h2 className="text-lg font-semibold text-muted-foreground">
                        {name || "Lista sem nome"}
                    </h2>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setIsEditing(true)}
                        className="h-6 w-6"
                    >
                        <Edit2 className="h-3 w-3" />
                    </Button>
                </div>
            )}
        </div>
    );
}

