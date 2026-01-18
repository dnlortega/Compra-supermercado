import { PrismaClient, Unit } from '@prisma/client';

const prisma = new PrismaClient();

const data = [
    {
        category: "Essenciais",
        products: [
            { name: "Arroz", unit: Unit.KG },
            { name: "Feijão", unit: Unit.KG },
            { name: "Açúcar", unit: Unit.KG },
            { name: "Café", unit: Unit.G },
            { name: "Farinha de trigo", unit: Unit.KG },
            { name: "Farinha de milho", unit: Unit.KG },
            { name: "Farinha de mandioca", unit: Unit.KG },
            { name: "Macarrão", unit: Unit.G },
            { name: "Sal", unit: Unit.KG },
            { name: "Óleo de soja", unit: Unit.ML },
            { name: "Azeite de oliva", unit: Unit.ML },
            { name: "Vinagre", unit: Unit.ML }
        ]
    },
    {
        category: "Mercearia",
        products: [
            { name: "Achocolatado", unit: Unit.G },
            { name: "Extrato de tomate", unit: Unit.G },
            { name: "Molho de tomate", unit: Unit.G },
            { name: "Passata de tomate", unit: Unit.G },
            { name: "Maionese", unit: Unit.G },
            { name: "Ketchup", unit: Unit.G },
            { name: "Mostarda", unit: Unit.G },
            { name: "Gelatina", unit: Unit.G },
            { name: "Pudim em pó", unit: Unit.G },
            { name: "Mistura para bolo", unit: Unit.G },
            { name: "Biscoito salgado", unit: Unit.G },
            { name: "Biscoito doce", unit: Unit.G },
            { name: "Biscoito recheado", unit: Unit.G },
            { name: "Biscoito wafer", unit: Unit.G },
            { name: "Atum em lata", unit: Unit.UN },
            { name: "Sardinha em lata", unit: Unit.UN },
            { name: "Queijo processado", unit: Unit.UN }
        ]
    },
    {
        category: "Matinal",
        products: [
            { name: "Cereal matinal", unit: Unit.G },
            { name: "Aveia", unit: Unit.G },
            { name: "Geleia", unit: Unit.G },
            { name: "Mel", unit: Unit.G },
            { name: "Leite em pó", unit: Unit.G },
            { name: "Leite condensado", unit: Unit.G },
            { name: "Creme de leite", unit: Unit.G }
        ]
    },
    {
        category: "Padaria",
        products: [
            { name: "Pão de forma", unit: Unit.UN },
            { name: "Pão integral", unit: Unit.UN },
            { name: "Pão sovado", unit: Unit.UN },
            { name: "Torrada", unit: Unit.G }
        ]
    },
    {
        category: "Hortifruti",
        products: [
            { name: "Banana", unit: Unit.KG },
            { name: "Maçã", unit: Unit.KG },
            { name: "Laranja", unit: Unit.KG },
            { name: "Uva", unit: Unit.KG },
            { name: "Mamão", unit: Unit.UN },
            { name: "Abacaxi", unit: Unit.UN },
            { name: "Melancia", unit: Unit.UN },
            { name: "Morango", unit: Unit.PKG },
            { name: "Limão", unit: Unit.KG },
            { name: "Manga", unit: Unit.KG },
            { name: "Batata", unit: Unit.KG },
            { name: "Cebola", unit: Unit.KG },
            { name: "Alho", unit: Unit.G },
            { name: "Cenoura", unit: Unit.KG },
            { name: "Chuchu", unit: Unit.KG },
            { name: "Abóbora", unit: Unit.KG },
            { name: "Tomate", unit: Unit.KG },
            { name: "Pimentão", unit: Unit.KG },
            { name: "Berinjela", unit: Unit.KG },
            { name: "Abobrinha", unit: Unit.KG },
            { name: "Alface", unit: Unit.UN },
            { name: "Couve", unit: Unit.UN },
            { name: "Rúcula", unit: Unit.UN },
            { name: "Espinafre", unit: Unit.UN },
            { name: "Repolho", unit: Unit.UN },
            { name: "Brócolis", unit: Unit.UN },
            { name: "Couve-flor", unit: Unit.UN },
            { name: "Salsinha", unit: Unit.UN },
            { name: "Cebolinha", unit: Unit.UN },
            { name: "Coentro", unit: Unit.UN },
            { name: "Manjericão", unit: Unit.UN }
        ]
    },
    {
        category: "Carnes & Aves",
        products: [
            { name: "Carne moída", unit: Unit.KG },
            { name: "Alcatra", unit: Unit.KG },
            { name: "Contrafilé", unit: Unit.KG },
            { name: "Patinho", unit: Unit.KG },
            { name: "Costela bovina", unit: Unit.KG },
            { name: "Acém", unit: Unit.KG },
            { name: "Peito de frango", unit: Unit.KG },
            { name: "Coxa e sobrecoxa", unit: Unit.KG },
            { name: "Asa de frango", unit: Unit.KG },
            { name: "Frango inteiro", unit: Unit.KG },
            { name: "Lombo suíno", unit: Unit.KG },
            { name: "Pernil suíno", unit: Unit.KG },
            { name: "Bisteca suína", unit: Unit.KG },
            { name: "Linguiça", unit: Unit.KG }
        ]
    },
    {
        category: "Peixaria",
        products: [
            { name: "Tilápia", unit: Unit.KG },
            { name: "Salmão", unit: Unit.KG },
            { name: "Bacalhau", unit: Unit.KG }
        ]
    },
    {
        category: "Frios & Laticínios",
        products: [
            { name: "Leite integral", unit: Unit.L },
            { name: "Leite desnatado", unit: Unit.L },
            { name: "Leite sem lactose", unit: Unit.L },
            { name: "Iogurte", unit: Unit.UN },
            { name: "Manteiga", unit: Unit.G },
            { name: "Margarina", unit: Unit.G },
            { name: "Queijo mussarela", unit: Unit.G },
            { name: "Queijo prato", unit: Unit.G },
            { name: "Queijo minas", unit: Unit.G },
            { name: "Queijo parmesão", unit: Unit.G },
            { name: "Requeijão", unit: Unit.G },
            { name: "Presunto", unit: Unit.G },
            { name: "Peito de peru", unit: Unit.G },
            { name: "Salame", unit: Unit.G },
            { name: "Mortadela", unit: Unit.G },
            { name: "Ovos", unit: Unit.UN }
        ]
    },
    {
        category: "Bebidas",
        products: [
            { name: "Água mineral", unit: Unit.L },
            { name: "Refrigerante", unit: Unit.L },
            { name: "Suco de caixinha", unit: Unit.L },
            { name: "Suco concentrado", unit: Unit.ML },
            { name: "Chá pronto", unit: Unit.L },
            { name: "Chá em saquinho", unit: Unit.G },
            { name: "Cerveja", unit: Unit.ML },
            { name: "Vinho", unit: Unit.ML },
            { name: "Espumante", unit: Unit.ML },
            { name: "Destilado", unit: Unit.ML }
        ]
    },
    {
        category: "Limpeza",
        products: [
            { name: "Detergente líquido", unit: Unit.ML },
            { name: "Sabão em pó", unit: Unit.KG },
            { name: "Sabão líquido", unit: Unit.L },
            { name: "Sabão em barra", unit: Unit.G },
            { name: "Amaciante", unit: Unit.L },
            { name: "Alvejante", unit: Unit.L },
            { name: "Desinfetante", unit: Unit.L },
            { name: "Limpador multiuso", unit: Unit.ML },
            { name: "Esponja de aço", unit: Unit.UN },
            { name: "Esponja de prato", unit: Unit.UN },
            { name: "Pano de chão", unit: Unit.UN },
            { name: "Saco de lixo", unit: Unit.UN },
            { name: "Limpador de box", unit: Unit.ML }
        ]
    },
    {
        category: "Higiene",
        products: [
            { name: "Papel higiênico", unit: Unit.UN },
            { name: "Papel toalha", unit: Unit.UN },
            { name: "Sabonete", unit: Unit.UN },
            { name: "Shampoo", unit: Unit.ML },
            { name: "Condicionador", unit: Unit.ML },
            { name: "Creme dental", unit: Unit.G },
            { name: "Enxaguante bucal", unit: Unit.ML },
            { name: "Desodorante", unit: Unit.ML },
            { name: "Fralda", unit: Unit.UN },
            { name: "Absorvente", unit: Unit.UN }
        ]
    },
    {
        category: "Lanches & Aperitivos",
        products: [
            { name: "Salgadinho de milho", unit: Unit.G },
            { name: "Batata chips", unit: Unit.G },
            { name: "Biscoito de polvilho", unit: Unit.G },
            { name: "Amendoim torrado", unit: Unit.G },
            { name: "Amendoim japonês", unit: Unit.G },
            { name: "Castanha de caju", unit: Unit.G },
            { name: "Nozes", unit: Unit.G },
            { name: "Azeitona", unit: Unit.G },
            { name: "Pipoca de milho", unit: Unit.G },
            { name: "Pipoca de micro-ondas", unit: Unit.G },
            { name: "Patê", unit: Unit.G }
        ]
    },
    {
        category: "Saúde & Bem-estar",
        products: [
            { name: "Multivitamínico", unit: Unit.UN },
            { name: "Vitamina C efervescente", unit: Unit.UN },
            { name: "Colágeno em pó", unit: Unit.G },
            { name: "Ômega 3", unit: Unit.UN },
            { name: "Barra de proteína", unit: Unit.UN },
            { name: "Barra de cereais", unit: Unit.UN },
            { name: "Adoçante", unit: Unit.ML }
        ]
    },
    {
        category: "Bebês",
        products: [
            { name: "Lenço umedecido", unit: Unit.UN },
            { name: "Pomada para assadura", unit: Unit.G },
            { name: "Shampoo infantil", unit: Unit.ML },
            { name: "Condicionador infantil", unit: Unit.ML },
            { name: "Sabonete líquido infantil", unit: Unit.ML },
            { name: "Fórmula infantil", unit: Unit.G },
            { name: "Papinha", unit: Unit.G },
            { name: "Mingau infantil", unit: Unit.G },
            { name: "Chupeta", unit: Unit.UN },
            { name: "Mamadeira", unit: Unit.UN }
        ]
    },
    {
        category: "Congelados",
        products: [
            { name: "Lasanha congelada", unit: Unit.G },
            { name: "Pizza congelada", unit: Unit.G },
            { name: "Hambúrguer", unit: Unit.G },
            { name: "Nuggets de frango", unit: Unit.G },
            { name: "Steak de frango", unit: Unit.G },
            { name: "Pão de queijo congelado", unit: Unit.G },
            { name: "Batata palito congelada", unit: Unit.G },
            { name: "Mix de legumes congelados", unit: Unit.G },
            { name: "Sorvete", unit: Unit.ML },
            { name: "Açaí congelado", unit: Unit.G },
            { name: "Polpa de fruta", unit: Unit.G }
        ]
    },
    {
        category: "Utilidades & Casa",
        products: [
            { name: "Vela", unit: Unit.UN },
            { name: "Fósforo", unit: Unit.UN },
            { name: "Isqueiro", unit: Unit.UN },
            { name: "Pilha AA", unit: Unit.UN },
            { name: "Pilha AAA", unit: Unit.UN },
            { name: "Lâmpada LED", unit: Unit.UN },
            { name: "Papel alumínio", unit: Unit.UN },
            { name: "Filme plástico", unit: Unit.UN },
            { name: "Papel manteiga", unit: Unit.UN },
            { name: "Filtro de papel para café", unit: Unit.UN },
            { name: "Inseticida", unit: Unit.ML },
            { name: "Repelente", unit: Unit.ML }
        ]
    },
    {
        category: "Bazar & Papelaria",
        products: [
            { name: "Pote plástico", unit: Unit.UN },
            { name: "Abridor de latas", unit: Unit.UN },
            { name: "Talheres", unit: Unit.UN },
            { name: "Copo de vidro", unit: Unit.UN },
            { name: "Caneta esferográfica", unit: Unit.UN },
            { name: "Bloco de anotações", unit: Unit.UN },
            { name: "Fita adesiva", unit: Unit.UN },
            { name: "Tesoura", unit: Unit.UN }
        ]
    },
    {
        category: "Pet Shop",
        products: [
            { name: "Ração para cães", unit: Unit.KG },
            { name: "Ração para gatos", unit: Unit.KG },
            { name: "Sachê para pets", unit: Unit.UN },
            { name: "Areia para gatos", unit: Unit.KG },
            { name: "Tapete higiênico", unit: Unit.UN }
        ]
    }
];

async function seed() {
    console.log('Starting extended seed of generic products...');

    for (const cat of data) {
        const category = await prisma.category.upsert({
            where: { name: cat.category },
            update: {},
            create: { name: cat.category }
        });

        for (const prod of cat.products) {
            await prisma.catalogProduct.upsert({
                where: { name: prod.name },
                update: {
                    categoryId: category.id,
                    defaultUnit: prod.unit
                },
                create: {
                    name: prod.name,
                    categoryId: category.id,
                    defaultUnit: prod.unit
                }
            });
        }
        console.log(`Category "${cat.category}" processed with ${cat.products.length} products.`);
    }

    console.log('Extended seed complete!');
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
