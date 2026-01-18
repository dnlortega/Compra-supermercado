import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const productsToSearch = [
    "pepino",
    "beringela",
    "verduras",
    "abacate",
    "kiwi",
    "folha de louro",
    "folha de louvo",
    "lentilha",
    "mistura",
    "iorgute",
    "iogurte",
    "cotonete"
];

async function check() {
    for (const name of productsToSearch) {
        const p = await prisma.catalogProduct.findFirst({
            where: {
                name: {
                    contains: name,
                    mode: 'insensitive'
                }
            },
            include: { category: true }
        });
        if (p) {
            console.log(`FOUND: "${name}" -> Exact: "${p.name}", Category: "${p.category?.name || 'NONE'}"`);
        } else {
            console.log(`NOT FOUND: "${name}"`);
        }
    }
}

check()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
