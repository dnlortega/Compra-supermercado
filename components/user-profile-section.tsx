"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Calendar, Shield, CheckCircle2, User } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UserProfileSectionProps {
    user: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
        emailVerified?: Date | null;
    };
}

export function UserProfileSection({ user }: UserProfileSectionProps) {
    const isEmailVerified = !!user.emailVerified;
    const emailDomain = user.email?.split("@")[1] || "";
    const isGoogleAccount = emailDomain === "gmail.com" || emailDomain.includes("google");

    return (
        <Card className="border-none shadow-xl bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl rounded-[2rem] overflow-hidden">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-xl text-primary">
                        <User className="size-5" />
                    </div>
                    <CardTitle className="text-xl font-bold">Meu Perfil</CardTitle>
                </div>
                <CardDescription>
                    Informações da sua conta Google
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Avatar e Nome */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                    {user.image ? (
                        <div className="relative size-16 overflow-hidden rounded-full border-2 border-primary/20 shadow-lg">
                            <Image
                                src={user.image}
                                alt={user.name || "Perfil"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                            <User className="size-8 text-primary" />
                        </div>
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold text-lg">{user.name || "Usuário"}</h3>
                            {isGoogleAccount && (
                                <Badge variant="outline" className="bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
                                    <CheckCircle2 className="size-3 mr-1" />
                                    Google
                                </Badge>
                            )}
                        </div>
                        {isEmailVerified && (
                            <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                                <Shield className="size-3" />
                                <span>Email verificado</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Informações */}
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                        <Mail className="size-4 text-muted-foreground" />
                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Email</p>
                            <p className="text-sm font-medium">{user.email || "Não informado"}</p>
                        </div>
                    </div>

                    {user.emailVerified && (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                            <Calendar className="size-4 text-muted-foreground" />
                            <div className="flex-1">
                                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Conta verificada em</p>
                                <p className="text-sm font-medium">
                                    {format(new Date(user.emailVerified), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/10">
                        <Shield className="size-4 text-primary" />
                        <div className="flex-1">
                            <p className="text-xs text-primary uppercase tracking-wider mb-1">Segurança</p>
                            <p className="text-sm font-medium">
                                {isEmailVerified ? "Conta verificada e segura" : "Conta não verificada"}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

