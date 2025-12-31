import Link from "next/link";
import { Suspense } from "react";
export const revalidate = 30;
import { PlusCircle, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/session";
import { UserGreeting } from "@/components/user-greeting";
import { NotificationManager } from "@/components/notification-manager";
import { OpenListAlert } from "./components/open-list-alert";
import { DashboardStats } from "./components/dashboard-stats";
import { RecentPurchases } from "./components/recent-purchases";

export default async function Home() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto pb-24">
      {/* Renderização imediata - acima da dobra */}
      <Suspense fallback={<div className="h-32 animate-pulse bg-muted/20 rounded-xl" />}>
        <UserGreeting user={user} />
      </Suspense>

      {/* Dados secundários - carregam depois */}
      <Suspense fallback={<div className="h-20 animate-pulse bg-muted/20 rounded-xl" />}>
        <OpenListAlert />
      </Suspense>

      <Suspense fallback={
        <section className="grid gap-4 sm:grid-cols-2">
          <div className="h-32 animate-pulse bg-muted/20 rounded-xl" />
          <div className="h-32 animate-pulse bg-muted/20 rounded-xl" />
        </section>
      }>
        <DashboardStats />
      </Suspense>

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

      <Suspense fallback={<div className="h-48 animate-pulse bg-muted/20 rounded-xl" />}>
        <RecentPurchases />
      </Suspense>
    </div>
  );
}
