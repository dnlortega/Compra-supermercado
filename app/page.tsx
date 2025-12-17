import Link from "next/link";
import { PlusCircle, ShoppingCart, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <header className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Olá, Daniel 👋</h1>
          <p className="text-sm text-muted-foreground">
            Controle suas compras do mês
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 0,00</div>
            <p className="text-xs text-muted-foreground">
              +0% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Itens na Lista</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Produtos pendentes
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/list" className="w-full">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-dashed border-2">
              <PlusCircle className="h-6 w-6" />
              <span>Nova Lista</span>
            </Button>
          </Link>
          <Link href="/summary" className="w-full">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Ver Relatórios</span>
            </Button>
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Últimas Compras</h2>
          <Button variant="link" size="sm" asChild>
            <Link href="/list">Ver todas</Link>
          </Button>
        </div>
        <div className="flex flex-col gap-2 text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border-2 border-dashed">
          <p>Nenhuma compra recente</p>
          <Button variant="link" size="sm" asChild>
            <Link href="/list" className="bg-transparent">Criar nova lista</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
