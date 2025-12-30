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
    LayoutDashboard,
    Users,
    Key,
    Lock
} from "lucide-react";

import Image from "next/image";
import DatabaseSchemaViewer from "@/components/about/database-schema-viewer";

export default function AboutPage() {
    return (
        <div className="container mx-auto p-4 max-w-3xl pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mb-10 text-center">
                <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white dark:bg-zinc-900 border mb-4 shadow-xl">
                    <Image
                        src="/logo.png"
                        alt="App Logo"
                        width={64}
                        height={64}
                        className="object-contain"
                    />
                </div>
                <h1 className="text-3xl font-black tracking-tight mb-2 text-primary">Minha Compra</h1>
                <p className="text-muted-foreground text-lg max-w-xl mx-auto">
                    Gestão inteligente de compras para lares modernos. Controle gastos, compartilhe listas e analise sua evolução financeira em uma única plataforma.
                </p>
            </div>

            <div className="space-y-12">
                {/* Seção: O Projeto */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-l-4 border-primary pl-4">
                        <Zap className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold uppercase tracking-tighter">O Ecossistema 2.0</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border-none shadow-md bg-accent/30 group hover:bg-accent/50 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <Users className="h-5 w-5" />
                                    Colaboração Real
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                Compartilhe suas listas e históricos com familiares. Gerencie permissões de acesso e mantenha todos na mesma página em tempo real.
                            </CardContent>
                        </Card>
                        <Card className="border-none shadow-md bg-accent/30 group hover:bg-accent/50 transition-colors">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                                    <Lock className="h-5 w-5" />
                                    Segurança Integrada
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground leading-relaxed">
                                Autenticação robusta via Google ou Credenciais criptografadas. Seus dados são protegidos e vinculados unicamente à sua conta e seus compartilhamentos.
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Seção: Diferenciais Técnicos */}
                <section>
                    <div className="flex items-center gap-2 mb-6 border-l-4 border-primary pl-4">
                        <Database className="h-6 w-6 text-primary" />
                        <h2 className="text-2xl font-bold uppercase tracking-tighter">Arquitetura de Dados</h2>
                    </div>

                    <div className="prose dark:prose-invert max-w-none text-muted-foreground text-sm mb-6 bg-muted/20 p-4 rounded-xl border border-dashed border-primary/20">
                        <p>
                            O sistema utiliza um banco de dados relacional <strong>PostgreSQL</strong> gerenciado pelo ORM <strong>Prisma</strong>.
                            A estrutura é centrada no usuário (<strong>User</strong>), que possui múltiplas listas de compras (<strong>ShoppingList</strong>).
                            Os produtos são normalizados em um catálogo global (<strong>CatalogProduct</strong>) para evitar duplicatas e permitir o rastreamento histórico de preços (<strong>PriceHistory</strong>) independente da lista.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="my-8 h-[400px]">
                            <DatabaseSchemaViewer />
                        </div>
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Catálogo Normalizado</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Ao adicionar "Arroz", o sistema busca ou cria uma referência única no catálogo. Isso permite que, no futuro, você saiba exatamente quanto pagou por "Arroz" em todas as suas compras passadas, gerando gráficos precisos de inflação pessoal.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-card border rounded-2xl p-6 shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Key className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">Modelo de Compartilhamento (SharedAccess)</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        Implementamos um modelo de relação N:N (Muitos-para-Muitos) para compartilhamento. A tabela <code>SharedAccess</code> conecta usuários donos e usuários convidados, permitindo que um usuário visualize e interaja com os dados de outro sem duplicar informações no banco.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Seção: Funcionalidades */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { icon: List, title: "Gestão Dinâmica", desc: "Listas abertas e fechadas com status claro." },
                        { icon: Receipt, title: "Preenchimento Rápido", desc: "UX otimizada para inserção rápida de preços no mercado." },
                        { icon: PieChart, title: "Análise de Gastos", desc: "Resumos detalhados e comparativos mensal vs. mensal." },
                        { icon: History, title: "Portabilidade JSON", desc: "Exportação e importação completa de dados para backup local." },
                    ].map((feat, i) => (
                        <div key={i} className="flex gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors">
                            <feat.icon className="h-6 w-6 text-primary shrink-0" />
                            <div>
                                <h4 className="font-bold">{feat.title}</h4>
                                <p className="text-xs text-muted-foreground leading-snug mt-1">{feat.desc}</p>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Seção: Tech Stack */}
                <section className="pt-8 border-t">
                    <h3 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Tecnologias Core</h3>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 opacity-80">
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-white dark:bg-white/10 rounded-full shadow-sm">
                                <Zap className="h-5 w-5 text-black dark:text-white" />
                            </div>
                            <span className="text-[10px] font-bold">Next.js 16</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-white dark:bg-white/10 rounded-full shadow-sm">
                                <Database className="h-5 w-5 text-blue-600" />
                            </div>
                            <span className="text-[10px] font-bold">Prisma ORM</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-white dark:bg-white/10 rounded-full shadow-sm">
                                <Smartphone className="h-5 w-5 text-teal-500" />
                            </div>
                            <span className="text-[10px] font-bold">Tailwind CSS</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-white dark:bg-white/10 rounded-full shadow-sm">
                                <ShieldCheck className="h-5 w-5 text-purple-600" />
                            </div>
                            <span className="text-[10px] font-bold">NextAuth v5</span>
                        </div>
                    </div>
                    <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-[0.2em] font-medium">
                        Desenvolvido por Daniel Ortega
                    </p>
                </section>
            </div>
        </div>
    );
}
