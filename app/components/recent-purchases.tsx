"use server";

import Link from "next/link";
import { Calendar, ChevronRight, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";

export async function RecentPurchases() {
  const user = await requireUser();
  
  let recentPurchases: any[] = [];

  try {
    recentPurchases = await prisma.shoppingList.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED"
      },
      select: {
        id: true,
        name: true,
        date: true,
        total: true,
      },
      orderBy: { date: "desc" },
      take: 3,
    });
  } catch (error) {
    console.error("Recent purchases error:", error);
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Últimas Compras</h2>
        <Button variant="link" size="sm" asChild className="text-xs font-bold uppercase">
          <Link href="/history">Ver todas</Link>
        </Button>
      </div>

      {recentPurchases.length > 0 ? (
        <div className="flex flex-col gap-3">
          {recentPurchases.map((list: any) => (
            <Link key={list.id} href={`/history/${list.id}`}>
              <Card className="hover:bg-accent/50 transition-all cursor-pointer overflow-hidden border-none bg-muted/20">
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-background p-2 rounded-full">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold uppercase text-sm">{list.name || "Compra"}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(list.date), "dd 'de' MMMM", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-primary">{formatCurrency(list.total)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 text-center py-10 text-muted-foreground bg-muted/10 rounded-xl border-2 border-dashed">
          <ShoppingCart className="h-8 w-8 mx-auto opacity-20 mb-2" />
          <p className="text-sm font-medium">Nenhuma compra finalizada</p>
          <Button variant="link" size="sm" asChild>
            <Link href="/list" className="text-primary font-bold">CRIAR PRIMEIRA LISTA</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

