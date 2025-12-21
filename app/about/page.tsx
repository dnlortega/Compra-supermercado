"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, ShoppingCart, List, Receipt, PieChart, History } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    return (
        <div className="container mx-auto p-4 max-w-2xl pb-24">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Info className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Sobre o App</h1>
                </div>
                <p className="text-muted-foreground">
                    Sistema para controle de compras de supermercado
                </p>
            </div>

            <div className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <List className="h-5 w-5" />
                            Lista de Compras
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Adicione produtos à sua lista, edite quantidades e gerencie seus itens antes da compra.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Preencher Valores
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Durante a compra, preencha os preços dos produtos. O sistema calcula automaticamente os totais e sugere preços anteriores.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Resumo da Compra
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Visualize o total gasto, o item mais caro e mais barato, e finalize sua compra.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Histórico
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            Acesse suas compras anteriores, visualize detalhes e acompanhe seus gastos ao longo do tempo.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
