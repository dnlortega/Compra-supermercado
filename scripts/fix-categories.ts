import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function determineCategoryName(name: string): string {
    const lower = name.toLowerCase();
    const categories: Record<string, string[]> = {
        "Essenciais": ["feijão", "feijao", "arroz", "açúcar", "acucar", "óleo", "oleo", "macarrão", "macarrao", "café", "cafe", "sal", "farinha", "molho", "extrato", "milho", "ervilha", "pipoca", "leite condensado", "creme de leite", "vinagre", "azeite", "tempero", "chimichurri", "páprica", "paprica", "colorau", "açafrão", "acafrao"],
        "Mercearia": ["biscoito", "bolacha", "maionese", "ketchup", "mostarda", "geleia", "farofa", "atum", "sardinha", "azeitona", "palmito", "gelatina"],
        "Matinal": ["cereal", "cerial", "nesfit", "granola", "aveia", "corn flakes", "achocolatado", "nescau", "toddy", "chá", "cha", "cápsula", "capsula", "nestlé", "neste"],
        "Bebidas": ["água", "agua", "suco", "refrigerante", "coca", "guaraná", "guarana", "cerveja", "vinho", "energético", "energetico", "coco", "chá gelado"],
        "Hortifruti": ["fruta", "legume", "banana", "maçã", "maca", "batata", "cebola", "tomate", "alface", "alho", "cenoura", "abóbora", "abobora", "chuchu", "limão", "limao", "laranja", "pêra", "pera", "melancia", "mamão", "mamao", "abacaxi", "couve", "brócolis", "brocolis", "pimentão", "pimentao", "abobrinha", "ameixa", "manga", "pêssego", "pessego", "beterraba", "ovo"],
        "Carnes & Aves": ["carne", "frango", "alcatra", "filé", "file", "costela", "coxa", "sobrecoxa", "salsicha", "linguiça", "linguica", "bacon", "bife", "hambúrguer", "hamburguer", "patinho", "coxão", "coxao", "maminha", "bisteca", "porco", "suíno", "suino"],
        "Peixaria": ["peixe", "tilápia", "tilapia", "camarão", "camarao", "bacalhau", "pescada", "salmão", "salmao"],
        "Frios & Laticínios": ["leite", "manteiga", "queijo", "presunto", "iogurte", "yorgute", "danone", "requeijão", "requeijao", "margarina", "mortadela", "salame", "peru"],
        "Padaria": ["pão", "pao", "bisnaga", "bolo", "rosca", "torrada", "panetone", "chocotone"],
        "Congelados": ["frango desfiado", "stick", "nuggets", "lasanha", "pizza", "hambúrguer congelado", "batata congelada"],
        "Limpeza": ["sabão", "sabao", "amaciante", "desinfetante", "pano", "detergente", "vash", "água sanitária", "agua sanitaria", "esponja", "limpa vidro", "desengordurante", "lustra móveis", "lustra moveis", "lixo", "vassoura", "rodo", "lava roupa", "lava roupas líquido", "lava roupas liquido", "sabão líquido", "sabao liquido", "bloco sanitário", "bloco sanitario", "pato", "limpa máquina", "limpa maquina", "veja"],
        "Higiene": ["papel higiênico", "papel higienico", "sabonete", "creme dental", "pasta de dente", "shampoo", "xampu", "condicionador", "desodorante", "escova", "fio dental", "enxaguante", "listerine", "absorvente", "algodão", "algodao", "lâmina", "lamina", "barbear", "papel toalha", "guardanapo"],
        "Tabacaria": ["cigarro", "fumo", "isqueiro", "palha", "narguile"],
        "Pet Shop": ["ração", "racao", "pet", "cão", "cao", "gato", "areia"],
        "Taxas & Serviços": ["entrega", "frete", "taxa"]
    };

    for (const [category, keywords] of Object.entries(categories)) {
        if (keywords.some(k => lower.includes(k))) return category;
    }
    return "Outros";
}

async function fix() {
    console.log('Starting category fix...');
    const products = await prisma.catalogProduct.findMany({
        include: { category: true }
    });

    console.log(`Found ${products.length} products total.`);

    for (const p of products) {
        const catName = determineCategoryName(p.name);

        if (catName !== "Outros" && (!p.category || p.category.name !== catName)) {
            const category = await prisma.category.upsert({
                where: { name: catName },
                update: {},
                create: { name: catName }
            });

            await prisma.catalogProduct.update({
                where: { id: p.id },
                data: { categoryId: category.id }
            });
            console.log(`Fixed: "${p.name}" updated to "${catName}"`);
        }
    }
    console.log('Done!');
}

fix()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
