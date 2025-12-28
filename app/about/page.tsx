"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Info,
    List,
    Receipt,
    PieChart,
    History,
    Database,
    Smartphone,
    Zap,
    ShieldCheck,
    CheckCircle2,
    TrendingUp,
    LayoutDashboard
} from "lucide-react";

import Image from "next/image";

export default function AboutPage() {
    return (
        <div className="container mx-auto p-4 max-w-3xl pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 mb-4 shadow-inner">
                    <Image
                        src="/logo.png"
                        alt="App Logo"
                        width={80}
                        height={80}
                        className="rounded-xl object-contain shadow-sm"
                    />
                </div>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Uma plataforma inteligente e robusta projetada para simplificar a gestão de compras domésticas, controlar gastos e analisar variações de preços.
                </p>
            </div>

            <div className="space-y-12">
                {/* Seção: O Projeto */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-l-4 border-primary pl-4">
                        <Zap className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold uppercase tracking-tighter">O Ecossistema</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-none shadow-md bg-accent/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <LayoutDashboard className="h-5 w-5 text-primary" />
                                    Dashboard Inteligente
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                Visão consolidada da sua lista aberta, estatísticas rápidas e acesso imediato às funções principais do app.
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md bg-accent/30">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-primary" />
                                    Integridade de Dados
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                Sincronização em tempo real com banco de dados relacional, garantindo que suas informações nunca se percam.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Seção: Diferenciais Técnicos */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-l-4 border-primary pl-4">
                        <Database className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold uppercase tracking-tighter">Inteligência de Dados</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Catálogo Global de Produtos</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Diferente de listas comuns, nosso sistema mantém um catálogo unificado. Isso evita duplicidade de nomes e permite que o app aprenda suas categorias preferidas automaticamente.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <TrendingUp className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Monitoramento de Inflação Pessoal</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        O sistema registra cada variação de preço. Ao preencher um valor, você recebe feedback visual imediato se o produto está mais caro ou mais barato que na última compra.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção: Funcionalidades */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: List, title: "Gestão Dinâmica", desc: "Criação flexível de itens com auto-categorização inteligente." },
                        { icon: Receipt, title: "Preenchimento Ágil", desc: "Interface otimizada para uso no mercado, permitindo inserção rápida de preços." },
                        { icon: PieChart, title: "Análise de Gastos", desc: "Resumos detalhados por categoria, destacando os maiores impactos no orçamento." },
                        { icon: History, title: "Portabilidade", desc: "Exportação e importação completa do histórico em formato JSON para backup." },
                    ].map((feat, i) => (
                        <div key={i} className="flex gap-4 p-4">
                            <feat.icon className="h-6 w-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold">{feat.title}</h4>
                                <p className="text-xs text-muted-foreground leading-snug">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Seção: Tech Stack */}
                <section className="pt-6 border-t">
                    <div className="flex flex-wrap justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Zap className="h-4 w-4" /> Next.js 15
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Database className="h-4 w-4" /> Prisma & PostgreSQL
                        </div>
                        <div className="flex items-center gap-2 text-sm font-bold">
                            <Smartphone className="h-4 w-4" /> Tailwind CSS
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-[0.2em]">
                        Desenvolvido com foco em UX Premium e Performance
                    </p>
                </section>
            </div>
        </div>
    );
}
