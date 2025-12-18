import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
// no cache revalidation — always rely on DB

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const list = await (prisma as any).shoppingList.findUnique({
            where: { id },
            include: {
                products: {
                    orderBy: { category: 'asc' }
                }
            },
        });

        if (!list) {
            return NextResponse.json({ error: "List not found" }, { status: 404 });
        }

        return NextResponse.json(list);
    } catch (_error) {
        console.error("Error fetching shopping list:", _error);
        return NextResponse.json({ error: "Failed to fetch list" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        // Delete the shopping list (products will be deleted automatically due to cascade)
        await (prisma as any).shoppingList.delete({
            where: { id },
        });

        // removed cache revalidation; pages will read from DB directly

        return NextResponse.json({ success: true });
    } catch (_error) {
        console.error("Error deleting shopping list:", _error);
        return NextResponse.json({ error: "Failed to delete shopping list" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const { date, name, createdAt, updatedAt } = await request.json();

        const data: any = {};
        if (date) {
            data.date = new Date(`${date}T12:00:00Z`);
        }
        if (name !== undefined) {
            data.name = name;
        }
        if (createdAt) {
            data.createdAt = new Date(`${createdAt}T12:00:00Z`);
        }
        if (updatedAt) {
            data.updatedAt = new Date(`${updatedAt}T12:00:00Z`);
        }

        if (Object.keys(data).length === 0) {
            return NextResponse.json({ error: "No data to update" }, { status: 400 });
        }

        await (prisma as any).shoppingList.update({
            where: { id },
            data,
        });

        // removed cache revalidation; pages will read from DB directly

        return NextResponse.json({ success: true });
    } catch (_error) {
        console.error("Error updating shopping list:", _error);
        return NextResponse.json({ error: "Failed to update shopping list" }, { status: 500 });
    }
}
