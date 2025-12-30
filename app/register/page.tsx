"use client";

import { useState } from "react";
import { register } from "@/app/actions/register";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);

        const result = await register(formData);

        if (result?.error) {
            toast.error(typeof result.error === "string" ? result.error : "Erro na validação");
            setLoading(false);
        } else {
            toast.success("Conta criada com sucesso! Faça login.");
            router.push("/login");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Elegant Background Accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] size-[600px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] size-[600px] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-[380px] flex flex-col items-center animate-in fade-in zoom-in duration-500 px-6">
                <Link href="/login" className="self-start mb-6 text-muted-foreground hover:text-foreground transition-colors flex items-center text-sm gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </Link>

                <div className="mb-8 text-center">
                    <div className="inline-block relative p-4 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={48}
                            height={48}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black tracking-tight mb-2 text-zinc-900 dark:text-white">
                        Criar Conta
                    </h1>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
                        Comece a gerenciar suas compras hoje.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-zinc-500">Nome Completo</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            className="h-12 rounded-2xl bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary/20"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-zinc-500">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="h-12 rounded-2xl bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary/20"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-zinc-500">Senha</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Mínimo 6 caracteres"
                            className="h-12 rounded-2xl bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary/20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-2xl font-bold text-sm bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] mt-2 shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Cadastrar"}
                    </Button>
                </form>

                <div className="mt-6 text-center text-xs text-muted-foreground">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="font-bold text-primary hover:underline">
                        Fazer login
                    </Link>
                </div>
            </div>
        </div>
    );
}
