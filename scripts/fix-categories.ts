import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fix() {
    console.log('Starting category fix...');
    const products = await prisma.catalogProduct.findMany({
        include: { category: true }
    });

    console.log(`Found ${products.length} products total.`);

    const rules = [
        { keywords: ['cigarro'], cat: 'Tabacaria' },
        { keywords: ['ameixa', 'manga', 'pêssego', 'pessego'], cat: 'Hortifruti' },
        { keywords: ['frango desfiado', 'stick', 'congelado', 'lasanha', 'pizza'], cat: 'Congelados' },
        { keywords: ['danone', 'yorgute', 'iogurte', 'leite', 'queijo'], cat: 'Frios & Laticínios' },
        { keywords: ['geleia', 'farofa', 'atum', 'sardinha', 'biscoito', 'bolacha'], cat: 'Mercearia' },
        { keywords: ['cereal', 'cerial', 'nesfit', 'granola', 'cápsula', 'capsula', 'neste'], cat: 'Matinal' },
        { keywords: ['bisteca', 'porco', 'carne'], cat: 'Carnes & Aves' },
        { keywords: ['listerine', 'sabonete', 'shampoo'], cat: 'Higiene' }
    ];

    for (const p of products) {
        let catName = null;
        const lower = p.name.toLowerCase();

        for (const rule of rules) {
            if (rule.keywords.some(k => lower.includes(k))) {
                catName = rule.cat;
                break;
            }
        }

        if (catName && (!p.category || p.category.name !== catName)) {
            const category = await prisma.category.upsert({
                where: { name: catName },
                update: {},
                create: { name: catName }
            });

            await prisma.catalogProduct.update({
                where: { id: p.id },
                data: { categoryId: category.id }
            });
            console.log(`Fixed: ${p.name} updated to ${catName}`);
        }
    }
    console.log('Done!');
}

fix()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
