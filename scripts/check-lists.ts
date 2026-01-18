import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkLists() {
    const list = await prisma.shoppingList.findFirst({
        orderBy: { createdAt: 'desc' },
        include: {
            items: {
                include: {
                    catalogProduct: {
                        include: { category: true }
                    }
                }
            }
        }
    });

    if (list) {
        console.log(`Latest list: "${list.name}" (${list.status})`);
        list.items.forEach(item => {
            console.log(`- ${item.quantity} ${item.unit} ${item.catalogProduct.name} (Category: ${item.catalogProduct.category?.name || 'NONE'})`);
        });
    } else {
        console.log("No shopping lists found.");
    }
}

checkLists()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
