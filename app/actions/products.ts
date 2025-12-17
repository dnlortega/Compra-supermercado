"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
    return await prisma.product.findMany({
        orderBy: { createdAt: "desc" },
    });
}

export async function addProduct(data: { name: string; quantity: number }) {
    await prisma.product.create({
        data: {
            name: data.name,
            quantity: data.quantity,
        },
    });
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
}

export async function updateProduct(id: string, data: Partial<{ name: string; quantity: number; unitPrice: number; checked: boolean }>) {
    // Fetch current product to check missing fields for calculation
    const current = await prisma.product.findUnique({ where: { id } });
    if (!current) throw new Error("Product not found");

    const quantity = data.quantity ?? current.quantity;
    const unitPrice = data.unitPrice !== undefined ? data.unitPrice : current.unitPrice;

    let totalPrice = current.totalPrice;
    if (unitPrice !== null && unitPrice !== undefined) {
        totalPrice = quantity * unitPrice;
    }

    await prisma.product.update({
        where: { id },
        data: {
            ...data,
            totalPrice,
        },
    });
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
}

export async function deleteProduct(id: string) {
    await prisma.product.delete({
        where: { id },
    });
    revalidatePath("/list");
    revalidatePath("/prices");
    revalidatePath("/summary");
}
