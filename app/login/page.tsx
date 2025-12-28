"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LoginPage() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
            {/* Elegant Background Accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] size-[600px] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] size-[600px] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-[360px] flex flex-col items-center animate-in fade-in zoom-in duration-1000">
                {/* Minimalist Logo Section */}
                <div className="mb-10 text-center">
                    <div className="inline-block relative p-4 rounded-3xl bg-white dark:bg-zinc-900 shadow-2xl shadow-zinc-200/50 dark:shadow-black/50 border border-zinc-100 dark:border-zinc-800 transform rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={64}
                            height={64}
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                {/* Content Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-black tracking-tight mb-3 text-zinc-900 dark:text-white uppercase italic">
                        Minha Compra
                    </h1>
                    <div className="h-1 w-12 bg-primary mx-auto rounded-full mb-4" />
                    <p className="text-sm text-zinc-400 dark:text-zinc-500 font-medium tracking-wide">
                        Gestão inteligente de compras.
                    </p>
                </div>

                {/* Action Section */}
                <div className="w-full">
                    <Button
                        variant="default"
                        size="lg"
                        className="group w-full h-[70px] bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 dark:text-black text-white text-lg font-bold gap-4 rounded-3xl shadow-2xl transition-all active:scale-95 flex items-center justify-center border-none"
                        onClick={() => signIn("google", { redirectTo: "/" })}
                    >
                        <svg className="size-6 bg-white rounded-md p-1" viewBox="0 0 24 24">
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
                        <span>Entrar com Google</span>
                    </Button>
                </div>

                {/* Subtle Branding */}
                <div className="mt-16 flex items-center gap-2 opacity-30">
                    <div className="h-px w-4 bg-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Smart Analytics
                    </span>
                    <div className="h-px w-4 bg-zinc-400" />
                </div>
            </div>
        </div>
    );
}
