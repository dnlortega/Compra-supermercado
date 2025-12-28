import Link from "next/link";
export const dynamic = "force-dynamic";
import { PlusCircle, ShoppingCart, TrendingUp, Calendar, ChevronRight, History, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { requireUser } from "@/lib/session";
import Image from "next/image";
import { UserGreeting } from "@/components/user-greeting";
import { NotificationManager } from "@/components/notification-manager";

export default async function Home() {
  const user = await requireUser();
  const firstName = user.name?.split(" ")[0] || "Usuário";
  const isAdmin = user.email === "dnlortega@gmail.com";

  const now = new Date();
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);

  const firstDayLastMonth = startOfMonth(subMonths(now, 1));
  const lastDayLastMonth = endOfMonth(subMonths(now, 1));

  // 1. Get total spent this month
  let totalSpent = 0;
  let totalSpentLastMonth = 0;
  let pendingItems = 0;
  let recentPurchases: any[] = [];
  let percentageChange = 0;
  let allUsers: any[] = [];

  try {
    const currentMonthLists = await prisma.shoppingList.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        date: {
          gte: firstDayOfMonth,
          lte: lastDayOfMonth,
        },
      },
    });
    totalSpent = currentMonthLists.reduce((acc, list) => acc + (list.total || 0), 0);

    // 2. Get total spent last month for comparison
    const lastMonthLists = await prisma.shoppingList.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED",
        date: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
    });
    totalSpentLastMonth = lastMonthLists.reduce((acc, list) => acc + (list.total || 0), 0);

    percentageChange = totalSpentLastMonth > 0
      ? Math.round(((totalSpent - totalSpentLastMonth) / totalSpentLastMonth) * 100)
      : 0;

    // 3. Get pending items count in open list
    const openList = await prisma.shoppingList.findFirst({
      where: {
        userId: user.id,
        status: "OPEN"
      },
      include: { _count: { select: { items: true } } },
    });
    pendingItems = openList?._count?.items || 0;

    // 4. Get recent purchases (last 3)
    recentPurchases = await prisma.shoppingList.findMany({
      where: {
        userId: user.id,
        status: "COMPLETED"
      },
      orderBy: { date: "desc" },
      take: 3,
    });

    // 5. Admin data
    if (isAdmin) {
      try {
        // Double check to prevent crashes if DB schema is out of sync
        allUsers = await prisma.user.findMany({
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { shoppingLists: true }
            }
          }
        });
      } catch (e) {
        console.error("Dashboard: Database not synced yet. Running in safe mode.");
        allUsers = [];
      }
    }
  } catch (error) {
    console.error("Dashboard: Global error fetch:", error);
  }

  // Calculate user stats
  const accountAge = user.emailVerified 
    ? Math.floor((new Date().getTime() - new Date(user.emailVerified).getTime()) / (1000 * 60 * 60 * 24))
    : null;
  const isGoogleAccount = user.email?.includes("gmail.com") || user.email?.includes("google");

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto pb-24 animate-in fade-in duration-700">
      <UserGreeting user={user} />

      {pendingItems > 0 && <NotificationManager pendingItemsCount={pendingItems} />}

      <section className="grid gap-4 sm:grid-cols-2">
        <Card className="bg-primary/5 border-primary/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Total Gasto (Mês)</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-primary">{formatCurrency(totalSpent)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {percentageChange >= 0 ? "+" : ""}{percentageChange}% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/30 border-muted/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Itens Pendentes</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black">{pendingItems}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Produtos na lista atual
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground ml-1">Ações Rápidas</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/list" className="w-full">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 border-dashed border-2 hover:bg-primary/5 hover:border-primary/50 transition-all">
              <PlusCircle className="h-6 w-6 text-primary" />
              <span className="font-bold">LISTA ATUAL</span>
            </Button>
          </Link>
          <Link href="/history" className="w-full">
            <Button variant="outline" className="w-full h-24 flex flex-col gap-2 hover:bg-primary/5 transition-all">
              <History className="h-6 w-6 text-primary" />
              <span className="font-bold">HISTÓRICO</span>
            </Button>
          </Link>
        </div>
      </section>

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
      {isAdmin && allUsers.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-dashed">
          <div className="flex items-center gap-2 ml-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Usuários do Sistema</h2>
            <Badge variant="outline" className="ml-auto bg-primary/5 text-primary border-primary/20">ADMIN</Badge>
          </div>

          <div className="grid gap-3">
            {allUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-accent/30 border border-primary/5">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 overflow-hidden rounded-full border shadow-sm">
                    {u.image ? (
                      <Image src={u.image} alt={u.name || "Avatar"} fill className="object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted uppercase text-xs font-bold">
                        {u.name?.charAt(0) || u.email?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">{u.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold uppercase text-muted-foreground tracking-tighter">Listas</div>
                  <div className="text-lg font-black text-primary leading-none">{u._count.shoppingLists}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
