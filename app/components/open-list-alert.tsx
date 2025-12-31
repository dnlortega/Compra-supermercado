"use server";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteListButton } from "@/components/delete-list-button";
import { OldListAlert } from "@/components/old-list-alert";
import { NotificationManager } from "@/components/notification-manager";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { differenceInDays } from "date-fns";

export async function OpenListAlert() {
  const user = await requireUser();
  
  let openList: any = null;
  let daysOpen = 0;
  let pendingItems = 0;

  try {
    openList = await prisma.shoppingList.findFirst({
      where: {
        userId: user.id,
        status: "OPEN"
      },
      select: {
        id: true,
        date: true,
        _count: { select: { items: true } }
      },
    });

    if (openList) {
      daysOpen = differenceInDays(new Date(), new Date(openList.date));
      pendingItems = openList._count.items;
    }
  } catch (error) {
    console.error("Open list alert error:", error);
  }

  if (!openList) return null;

  return (
    <>
      {daysOpen > 5 ? (
        <OldListAlert listId={openList.id} daysOpen={daysOpen} />
      ) : (
        <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/20 p-2 rounded-full hidden sm:block">
              <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-bold text-orange-800 dark:text-orange-200">Lista em Andamento</p>
              <p className="text-xs text-orange-700/80 dark:text-orange-300/80">Você tem uma lista não finalizada.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DeleteListButton hasItems={pendingItems > 0} />
            <Link href="/list">
              <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-sm">
                Continuar
              </Button>
            </Link>
          </div>
        </div>
      )}
      {pendingItems > 0 && <NotificationManager pendingItemsCount={pendingItems} />}
    </>
  );
}

