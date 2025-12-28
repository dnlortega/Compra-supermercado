import SharingSection from "@/components/sharing-section";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
    return (
        <div className="container mx-auto p-4 max-w-2xl min-h-screen pb-24">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/">
                    <Button variant="ghost" size="icon" className="rounded-full">
                        <ArrowLeft className="size-6" />
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    <SettingsIcon className="size-6 text-primary" />
                    <h1 className="text-2xl font-black tracking-tight">Configurações</h1>
                </div>
            </div>

            <div className="space-y-8">
                <section>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-2">Colaboração</h2>
                    <SharingSection />
                </section>

                <section className="pt-8 border-t border-dashed">
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-4 ml-2">Sobre o App</h2>
                    <div className="p-6 rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 text-center">
                        <p className="text-sm text-zinc-500 font-medium">
                            Controle de Supermercado v2.0
                        </p>
                        <p className="text-[10px] text-zinc-400 mt-1 uppercase tracking-widest">
                            Sincronização Inteligente & Privacidade
                        </p>
                    </div>
                </section>
            </div>
        </div>
    );
}
