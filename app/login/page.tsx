"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdSenseResponsive } from "@/components/adsense";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Email ou senha incorretos");
            } else {
                router.push("/");
                router.refresh();
            }
        } catch (error) {
            toast.error("Erro ao fazer login");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Elegant Background Accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] size-[600px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] size-[600px] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-[380px] flex flex-col items-center animate-in fade-in zoom-in duration-1000 px-6">
                {/* Minimalist Logo Section */}
                <div className="mb-8 text-center">
                    <div className="inline-block relative p-4 rounded-3xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-100 dark:border-zinc-800 transform rotate-[-2deg]">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={56}
                            height={56}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-black tracking-tight mb-2 text-zinc-900 dark:text-white uppercase italic">
                        Minha Compra
                    </h1>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
                        Gestão inteligente de compras.
                    </p>
                </div>

                {/* Form Section */}
                <form onSubmit={handleCredentialsLogin} className="w-full space-y-4 mb-6">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[10px] uppercase font-bold tracking-widest ml-1 text-zinc-500">E-mail</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="h-12 rounded-2xl bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary/20 transition-all font-medium"
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
                            placeholder="••••••••"
                            className="h-12 rounded-2xl bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 focus:ring-primary/20 transition-all font-medium"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-2xl font-bold text-sm bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] shadow-lg shadow-primary/20"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Entrar na conta"}
                    </Button>
                </form>

                {/* Divider */}
                <div className="w-full flex items-center gap-4 mb-6">
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">ou</span>
                    <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
                </div>

                {/* Google Button Section */}
                <div className="w-full space-y-4">
                    <Button
                        variant="ghost"
                        size="lg"
                        className="w-full h-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-bold gap-3 rounded-2xl shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all active:scale-95"
                        onClick={() => signIn("google", { redirectTo: "/" })}
                    >
                        <svg className="size-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span>Continuar com Google</span>
                    </Button>

                    <div className="text-center text-xs text-muted-foreground">
                        Não tem uma conta?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline">
                            Cadastre-se
                        </Link>
                    </div>

                    {/* Google AdSense */}
                    <div className="mt-8">
                        <AdSenseResponsive className="rounded-2xl overflow-hidden" />
                    </div>
                </div>
            </div>
        </div>
    );
}
