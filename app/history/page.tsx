import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { getHistory } from "@/app/actions/history";
import { HistoryClient } from "./history-client";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";
export const revalidate = 60; // Revalidate every 60 seconds

type HistoryItem = {
    month: string;
    lists: {
        id: string;
        date: Date;
        total: number;
        itemCount: number;
        name: string | null;
    }[];
};

async function HistoryData() {
    const history = await getHistory();
    return <HistoryClient initialHistory={history} />;
}

export default function HistoryPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto p-4 max-w-2xl space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
        }>
            <HistoryData />
        </Suspense>
    );
}

