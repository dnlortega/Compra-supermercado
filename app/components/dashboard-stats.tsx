"use server";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { startOfMonth, endOfMonth, subMonths } from "date-fns";

export async function DashboardStats() {
  const user = await requireUser();
  const now = new Date();
  const firstDayOfMonth = startOfMonth(now);
  const lastDayOfMonth = endOfMonth(now);
  const firstDayLastMonth = startOfMonth(subMonths(now, 1));
  const lastDayLastMonth = endOfMonth(subMonths(now, 1));

  let totalSpent = 0;
  let totalSpentLastMonth = 0;
  let pendingItems = 0;
  let percentageChange = 0;

  try {
    const [currentMonthListsResult, lastMonthListsResult, openListResult] = await Promise.all([
      prisma.shoppingList.findMany({
        where: {
          userId: user.id,
          status: "COMPLETED",
          date: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth,
          },
        },
        select: { total: true },
      }),
      prisma.shoppingList.findMany({
        where: {
          userId: user.id,
          status: "COMPLETED",
          date: {
            gte: firstDayLastMonth,
            lte: lastDayLastMonth,
          },
        },
        select: { total: true },
      }),
      prisma.shoppingList.findFirst({
        where: {
          userId: user.id,
          status: "OPEN"
        },
        select: {
          _count: { select: { items: true } }
        },
      }),
    ]);

    totalSpent = currentMonthListsResult.reduce((acc, list) => acc + (list.total || 0), 0);
    totalSpentLastMonth = lastMonthListsResult.reduce((acc, list) => acc + (list.total || 0), 0);
    percentageChange = totalSpentLastMonth > 0
      ? Math.round(((totalSpent - totalSpentLastMonth) / totalSpentLastMonth) * 100)
      : 0;
    pendingItems = openListResult?._count?.items || 0;
  } catch (error) {
    console.error("Dashboard stats error:", error);
  }

  return (
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
  );
}

