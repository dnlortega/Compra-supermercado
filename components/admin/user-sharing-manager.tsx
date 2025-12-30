"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, UserPlus } from "lucide-react";
import { toggleSharing } from "@/app/actions/admin";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

type UserBasic = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
};

type UserWithSharing = UserBasic & {
    sharedWith: { sharedTo: UserBasic }[];
};

export function UserSharingManager({
    user,
    allUsers
}: {
    user: UserWithSharing;
    allUsers: UserBasic[];
}) {
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);

    // We maintain local state to update UI immediately without full page reload feels
    // although the server action revalidates the path, optimistic UI is nicer but 
    // for admin panel, standard reload is fine. 
    // To make it feel responsive, we rely on the parent page revalidation.

    const handleToggle = async (targetId: string, enable: boolean) => {
        setLoading(true);
        try {
            const res = await toggleSharing(user.id, targetId, enable);
            if (res.success) {
                toast.success(enable ? "Compartilhamento adicionado" : "Compartilhamento removido");
                if (enable) setDialogOpen(false);
            } else {
                toast.error(res.error || "Erro ao alterar compartilhamento");
            }
        } catch (e) {
            toast.error("Erro desconhecido");
        } finally {
            setLoading(false);
        }
    };

    const sharedIds = new Set(user.sharedWith.map(s => s.sharedTo.id));
    // Users that are NOT me and NOT already shared with
    const availableUsers = allUsers.filter(u => u.id !== user.id && !sharedIds.has(u.id));

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Compartilhando com:</h3>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                            <UserPlus className="h-3 w-3 mr-2" />
                            Adicionar
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar acesso para {user.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-2 mt-2 max-h-[60vh] overflow-y-auto">
                            {availableUsers.length === 0 ? (
                                <p className="text-center text-muted-foreground py-4 text-sm">
                                    Todos os usuários já têm acesso.
                                </p>
                            ) : (
                                availableUsers.map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg border transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted border">
                                                {u.image ? (
                                                    <Image src={u.image} alt={u.name || ""} fill className="object-cover" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full w-full bg-primary/10 text-primary text-xs font-bold">
                                                        {u.name?.[0] || "?"}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm leading-none">{u.name}</p>
                                                <p className="text-xs text-muted-foreground">{u.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() => handleToggle(u.id, true)}
                                            disabled={loading}
                                            className="gap-2"
                                        >
                                            <UserPlus className="h-3 w-3" />
                                            Adicionar
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            {user.sharedWith.length === 0 ? (
                <div className="p-4 border border-dashed rounded-lg bg-muted/20 text-center">
                    <p className="text-sm text-muted-foreground italic">Não está compartilhando dados com ninguém.</p>
                </div>
            ) : (
                <div className="grid gap-2">
                    {user.sharedWith.map(({ sharedTo: u }) => (
                        <div key={u.id} className="flex items-center justify-between p-2 bg-background hover:bg-muted/30 rounded-lg border transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="relative h-8 w-8 rounded-full overflow-hidden bg-muted border">
                                    {u.image ? (
                                        <Image src={u.image} alt={u.name || ""} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full w-full bg-primary/10 text-primary text-xs font-bold">
                                            {u.name?.[0] || "?"}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-sm leading-none">{u.name}</p>
                                    <p className="text-xs text-muted-foreground">{u.email}</p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                onClick={() => handleToggle(u.id, false)}
                                disabled={loading}
                                title="Remover acesso"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
