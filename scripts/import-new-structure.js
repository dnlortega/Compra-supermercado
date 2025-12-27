const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

async function main() {
    const prisma = new PrismaClient();
    const filePath = path.resolve(process.cwd(), process.argv[2] || 'historico-compras-2025-12-18.json');

    if (!fs.existsSync(filePath)) {
        console.error('File not found:', filePath);
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const lists = Array.isArray(data) ? data : [data];

    console.log(`Starting import of ${lists.length} lists...`);

    for (const listData of lists) {
        console.log(`Importing list: ${listData.name || listData.id}`);

        const list = await prisma.shoppingList.upsert({
            where: { id: listData.id },
            update: {
                name: listData.name,
                date: new Date(listData.date),
                status: listData.status,
                total: listData.total
            },
            create: {
                id: listData.id,
                name: listData.name,
                date: new Date(listData.date),
                status: listData.status,
                total: listData.total,
                createdAt: listData.createdAt ? new Date(listData.createdAt) : undefined
            }
        });

        const products = listData.products || [];
        for (const p of products) {
            try {
                // 1. Ensure category
                const catName = p.category || 'Outros';
                const category = await prisma.category.upsert({
                    where: { name: catName },
                    update: {},
                    create: { name: catName }
                });

                // 2. Ensure catalog product
                const catalogProduct = await prisma.catalogProduct.upsert({
                    where: { name: p.name },
                    update: { categoryId: category.id },
                    create: {
                        name: p.name,
                        categoryId: category.id
                    }
                });

                // 3. Create shopping list item
                await prisma.shoppingListItem.create({
                    data: {
                        id: p.id,
                        quantity: p.quantity || 1,
                        unitPrice: p.unitPrice,
                        totalPrice: p.totalPrice,
                        checked: p.checked || false,
                        shoppingListId: list.id,
                        catalogProductId: catalogProduct.id,
                        createdAt: p.createdAt ? new Date(p.createdAt) : undefined
                    }
                });

                // 4. Create price history entry if unitPrice exists
                if (p.unitPrice) {
                    await prisma.priceHistory.create({
                        data: {
                            catalogProductId: catalogProduct.id,
                            unitPrice: p.unitPrice,
                            purchaseDate: list.date
                        }
                    });
                }
            } catch (err) {
                console.error(`Failed to import product ${p.name}:`, err.message);
            }
        }
    }

    console.log('Import finished!');
    await prisma.$disconnect();
}

main().catch(console.error);
