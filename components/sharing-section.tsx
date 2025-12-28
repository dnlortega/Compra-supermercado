"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { shareDataAccess, revokeSharedAccess, getPeopleIHaveSharedWith, getPeopleSharingWithMe } from "@/app/actions/sharing";
import { toast } from "sonner";
import { UserPlus, UserMinus, Shield, ShieldAlert, ArrowRightLeft, Users } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SharingSection() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [myShares, setMyShares] = useState<any[]>([]);
    const [sharesWithMe, setSharesWithMe] = useState<any[]>([]);
    const router = useRouter();

    const loadShares = async () => {
        try {
            const [mine, withMe] = await Promise.all([
                getPeopleIHaveSharedWith(),
                getPeopleSharingWithMe()
            ]);
            setMyShares(mine);
            setSharesWithMe(withMe);
        } catch (error) {
            console.error("Erro ao carregar compartilhamentos", error);
        }
    };

    useEffect(() => {
        loadShares();
    }, []);

    const handleShare = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Por favor, insira um e-mail válido");
            return;
        }
        setLoading(true);
        try {
            const result = await shareDataAccess(email.trim().toLowerCase());
            if (result && result.success) {
                toast.success("Dados compartilhados com sucesso!");
                setEmail("");
                await loadShares();
                router.refresh();
            } else {
                // Mostrar mensagem de erro específica
                const errorMessage = result?.error || "Erro ao compartilhar dados";
                toast.error(errorMessage);
            }
        } catch (error: any) {
            // Fallback para erros inesperados
            console.error("Erro inesperado ao compartilhar:", error);
            toast.error(error?.message || "Erro inesperado ao compartilhar dados");
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = async (userId: string) => {
        try {
            const result = await revokeSharedAccess(userId);
            if (result && result.success) {
                toast.success("Acesso removido");
                await loadShares();
                router.refresh();
            } else {
                toast.error("Erro ao remover acesso");
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao remover acesso");
        }
    };

    return (
        <div className="space-y-6">
            <Card className="border-none shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
                <CardHeader className="pb-4">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary/10 rounded-xl text-primary">
                            <UserPlus className="size-5" />
                        </div>
                        <CardTitle className="text-xl font-bold">Compartilhar meus dados</CardTitle>
                    </div>
                    <CardDescription>
                        Permita que outra pessoa visualize e gerencie suas listas de compras.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleShare} className="flex gap-2">
                        <Input
                            placeholder="E-mail da pessoa"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-xl"
                            required
                        />
                        <Button type="submit" disabled={loading} className="rounded-xl font-bold">
                            {loading ? "..." : "Compartilhar"}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Minhas permissões cedidas */}
                <Card className="border-none shadow-lg rounded-[2rem] bg-white dark:bg-zinc-900">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-zinc-500 uppercase text-[10px] font-black tracking-widest">
                            <Shield className="size-3" />
                            Pessoas com acesso aos meus dados
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {myShares.length === 0 ? (
                                <p className="text-sm text-zinc-400 italic py-4">Você ainda não compartilhou seus dados com ninguém.</p>
                            ) : (
                                myShares.map((share) => (
                                    <div key={share.sharedTo.id} className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                                        <div className="flex items-center gap-3">
                                            <div className="relative size-10 rounded-full overflow-hidden border">
                                                {share.sharedTo.image ? (
                                                    <Image src={share.sharedTo.image} alt={share.sharedTo.name || ""} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold">
                                                        {share.sharedTo.name?.[0]}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold">{share.sharedTo.name}</p>
                                                <p className="text-[10px] text-zinc-500">{share.sharedTo.email}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl"
                                            onClick={() => handleRevoke(share.sharedTo.id)}
                                        >
                                            <UserMinus className="size-4" />
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Dados compartilhados comigo */}
                <Card className="border-none shadow-lg rounded-[2rem] bg-white dark:bg-zinc-900">
                    <CardHeader className="pb-2">
                        <div className="flex items-center gap-2 text-primary uppercase text-[10px] font-black tracking-widest">
                            <ArrowRightLeft className="size-3" />
                            Dados compartilhados comigo
                        </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {sharesWithMe.length === 0 ? (
                                <p className="text-sm text-zinc-400 italic py-4">Ninguém compartilhou dados com você ainda.</p>
                            ) : (
                                sharesWithMe.map((share) => (
                                    <div key={share.sharedBy.id} className="flex items-center gap-3 p-3 rounded-2xl bg-primary/5 border border-primary/10">
                                        <div className="relative size-10 rounded-full overflow-hidden border border-primary/20">
                                            {share.sharedBy.image ? (
                                                <Image src={share.sharedBy.image} alt={share.sharedBy.name || ""} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                                                    {share.sharedBy.name?.[0]}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold">{share.sharedBy.name}</p>
                                            <p className="text-[10px] text-zinc-500">{share.sharedBy.email}</p>
                                        </div>
                                        <div className="ml-auto">
                                            <ShieldAlert className="size-4 text-primary opacity-50" />
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
