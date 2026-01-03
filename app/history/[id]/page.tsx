import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import HistoryDetailClient from "./history-detail-client";

export const dynamic = "force-dynamic";

export default async function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const list = await prisma.shoppingList.findUnique({
        where: { id },
        include: {
            items: {
                include: {
                    catalogProduct: {
                        include: { category: true }
                    }
                },
                orderBy: { catalogProduct: { name: 'asc' } }
            }
        },
    });

    if (!list) {
        notFound();
    }

    // Preparar os dados para o componente cliente (já mapeado)
    const formattedList = {
        ...list,
        products: list.items.map((item: any) => ({
            id: item.id,
            name: item.catalogProduct?.name || "Produto sem nome",
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
            category: item.catalogProduct?.category?.name || "Outros"
        }))
    };

    return <HistoryDetailClient listId={id} initialData={formattedList as any} />;
}
