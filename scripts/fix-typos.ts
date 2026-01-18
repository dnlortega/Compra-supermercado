import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixNames() {
    const fixes = [
        { old: "iorgute", new: "iogurte" },
        { old: "folha de louvo", new: "folha de louro" }
    ];

    for (const fix of fixes) {
        const product = await prisma.catalogProduct.findFirst({
            where: { name: { equals: fix.old, mode: 'insensitive' } }
        });

        if (product) {
            // Check if the NEW name already exists to avoid conflict
            const existing = await prisma.catalogProduct.findFirst({
                where: { name: { equals: fix.new, mode: 'insensitive' } }
            });

            if (!existing) {
                await prisma.catalogProduct.update({
                    where: { id: product.id },
                    data: { name: fix.new }
                });
                console.log(`Renamed: "${product.name}" -> "${fix.new}"`);
            } else {
                console.log(`Skipped: "${fix.new}" already exists.`);
            }
        }
    }
}

fixNames()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
