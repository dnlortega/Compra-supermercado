"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    ShoppingCart, 
    List, 
    Receipt, 
    PieChart, 
    History, 
    BookOpen,
    Plus,
    Edit,
    Trash2,
    CheckCheck,
    TrendingUp,
    Calendar,
    FileText,
    Upload,
    Download,
    Settings,
    Info
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Data da última atualização do sistema
const LAST_UPDATE = new Date("2024-12-19T14:30:00");

export default function AboutPage() {
    return (
        <div className="container mx-auto p-4 max-w-4xl pb-24">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <Info className="h-8 w-8 text-primary" />
                    <h1 className="text-3xl font-bold">Documentação do Sistema</h1>
                </div>
                <p className="text-muted-foreground">
                    Informações completas sobre funcionalidades, ações e recursos disponíveis
                </p>
                <div className="mt-4 p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Última Atualização: {format(LAST_UPDATE, "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </p>
                </div>
            </div>

            {/* Páginas Principais */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <ShoppingCart className="h-6 w-6" />
                    Páginas Principais
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <List className="h-5 w-5" />
                                Lista de Compras (/list)
                            </CardTitle>
                            <CardDescription>Gerenciamento de produtos da lista atual</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <Plus className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Adicionar produtos com sugestões automáticas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Edit className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <span>Editar nome e quantidade dos produtos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Trash2 className="h-4 w-4 text-red-500 mt-0.5" />
                                    <span>Remover produtos da lista</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 text-purple-500 mt-0.5" />
                                    <span>Incrementar/decrementar quantidade</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 text-orange-500 mt-0.5" />
                                    <span>Copiar produto para histórico</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Upload className="h-4 w-4 text-cyan-500 mt-0.5" />
                                    <span>Importar lista aberta</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Preencher Valores (/prices)
                            </CardTitle>
                            <CardDescription>Preenchimento de preços durante a compra</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <Edit className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <span>Inserir preço unitário e quantidade</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Visualizar último preço pago</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <History className="h-4 w-4 text-purple-500 mt-0.5" />
                                    <span>Consultar histórico de preços do produto</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 text-orange-500 mt-0.5" />
                                    <span>Alterar data da compra</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCheck className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Cálculo automático de subtotal e total</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieChart className="h-5 w-5" />
                                Resumo da Compra (/summary)
                            </CardTitle>
                            <CardDescription>Visão geral e finalização da compra</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Total gasto na compra atual</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Badge variant="destructive" className="mr-2">Item mais caro</Badge>
                                    <span>Identificação do produto mais caro</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Badge variant="default" className="mr-2">Item mais barato</Badge>
                                    <span>Identificação do produto mais barato</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <List className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <span>Lista completa de produtos com valores</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCheck className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Finalizar compra e salvar no histórico</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <History className="h-5 w-5" />
                                Histórico de Compras (/history)
                            </CardTitle>
                            <CardDescription>Visualização e gerenciamento de compras passadas</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <Calendar className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <span>Visualização por mês/ano</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <FileText className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Detalhes completos de cada compra</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Plus className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Adicionar produtos a compras antigas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Edit className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <span>Editar preços de produtos históricos</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Trash2 className="h-4 w-4 text-red-500 mt-0.5" />
                                    <span>Remover produtos ou compras inteiras</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Download className="h-4 w-4 text-purple-500 mt-0.5" />
                                    <span>Exportar compra individual</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Página Inicial (/)
                            </CardTitle>
                            <CardDescription>Dashboard com estatísticas e resumo</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Total gasto no mês atual</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <Badge variant="outline" className="mr-2">Comparação</Badge>
                                    <span>Variação percentual vs mês anterior</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <List className="h-4 w-4 text-blue-500 mt-0.5" />
                                    <span>Quantidade de itens pendentes</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <History className="h-4 w-4 text-purple-500 mt-0.5" />
                                    <span>Últimas 3 compras realizadas</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCheck className="h-4 w-4 text-green-500 mt-0.5" />
                                    <span>Acesso rápido a todas as funcionalidades</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Ações do Sistema */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Ações e Funções do Sistema
                </h2>
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciamento de Produtos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <Badge variant="outline" className="mb-2">addProduct</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Adiciona um novo produto à lista de compras aberta. Categoriza automaticamente o produto baseado no nome.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">updateProduct</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Atualiza nome, quantidade, preço unitário ou status de um produto. Recalcula automaticamente o preço total.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">deleteProduct</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Remove um produto da lista. Limpa automaticamente o histórico de preços relacionado e remove do catálogo se não houver outras ocorrências.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">getProducts</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Retorna todos os produtos da lista de compras aberta. Migra automaticamente produtos órfãos para a lista atual.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">getAllProductNames</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Retorna lista única de nomes de produtos (histórico + atual) para sugestões automáticas.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Gerenciamento de Listas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <Badge variant="outline" className="mb-2">finishShoppingList</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Finaliza a lista de compras atual, marca como COMPLETED, calcula o total e cria automaticamente uma nova lista vazia para a próxima compra.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">getOpenList</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Retorna a lista de compras aberta mais recente com todos os produtos.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">getHistory</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Retorna histórico de compras agrupadas por mês/ano, ordenadas por data decrescente.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">updateShoppingListDate</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Atualiza a data de uma lista de compras específica.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Histórico de Preços</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <Badge variant="outline" className="mb-2">savePriceHistory</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Salva uma entrada no histórico de preços quando um produto recebe um preço durante a compra.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">getPriceHistory</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Retorna as últimas 10 entradas de preço de um produto específico, ordenadas por data decrescente.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">getLastPrice</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Retorna o último preço pago por um produto específico para sugestão automática.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">cleanupPriceHistoryForPurchase</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Remove entradas do histórico de preços quando um produto é removido de uma compra histórica, mantendo sincronização entre histórico de compras e preços.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Catálogo de Produtos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <Badge variant="outline" className="mb-2">getCatalogProducts</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Retorna produtos do catálogo agrupados por categoria para facilitar a seleção.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">createCatalogProduct</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Adiciona ou atualiza um produto no catálogo com categoria opcional.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">seedCatalog</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Popula o catálogo com produtos padrão organizados por categorias pré-definidas.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Exportação e Importação</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div>
                                    <Badge variant="outline" className="mb-2">exportAllHistory</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Exporta todo o histórico de compras em formato JSON para backup ou migração.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">exportSingleList</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Exporta uma lista de compras específica com todos os produtos em formato JSON.
                                    </p>
                                </div>
                                <div>
                                    <Badge variant="outline" className="mb-2">importData</Badge>
                                    <p className="text-sm text-muted-foreground">
                                        Importa listas de compras a partir de arquivo JSON, criando novas listas no sistema.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* APIs Disponíveis */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-6 w-6" />
                    APIs e Endpoints
                </h2>
                <div className="grid gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Endpoints de Lista de Compras</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm font-mono">
                                <div><Badge variant="secondary" className="mr-2">GET</Badge> /api/shopping-list/[id]</div>
                                <div><Badge variant="secondary" className="mr-2">DELETE</Badge> /api/shopping-list/[id]</div>
                                <div><Badge variant="secondary" className="mr-2">POST</Badge> /api/shopping-list/[id]/product</div>
                                <div><Badge variant="secondary" className="mr-2">PATCH</Badge> /api/shopping-list/[id]/product/[productId]</div>
                                <div><Badge variant="secondary" className="mr-2">DELETE</Badge> /api/shopping-list/[id]/product/[productId]</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Categorias Automáticas */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="h-6 w-6" />
                    Categorias Automáticas
                </h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 text-sm">
                            <div>
                                <Badge variant="default" className="mb-2">Essenciais</Badge>
                                <p className="text-muted-foreground">Arroz, feijão, óleo, macarrão, café, açúcar, sal, farinha, biscoitos, molhos, etc.</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Bebidas</Badge>
                                <p className="text-muted-foreground">Água, suco, refrigerante, cerveja, vinho, energético, água de coco, chá gelado</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Hortifruti</Badge>
                                <p className="text-muted-foreground">Frutas, legumes, verduras, tomate, cebola, batata, banana, maçã, etc.</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Carnes & Aves</Badge>
                                <p className="text-muted-foreground">Carne, frango, peixe, bacon, linguiça, salsicha, hambúrguer, etc.</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Frios & Laticínios</Badge>
                                <p className="text-muted-foreground">Leite, queijo, presunto, iogurte, ovos, requeijão, margarina, etc.</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Padaria</Badge>
                                <p className="text-muted-foreground">Pão, bisnaga, bolo, rosca, torrada</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Limpeza</Badge>
                                <p className="text-muted-foreground">Detergente, sabão, amaciante, desinfetante, água sanitária, esponja, etc.</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Higiene</Badge>
                                <p className="text-muted-foreground">Papel higiênico, sabonete, pasta de dente, shampoo, desodorante, etc.</p>
                            </div>
                            <div>
                                <Badge variant="default" className="mb-2">Pet Shop</Badge>
                                <p className="text-muted-foreground">Ração, areia sanitária, petiscos</p>
                            </div>
                            <div>
                                <Badge variant="outline" className="mb-2">Outros</Badge>
                                <p className="text-muted-foreground">Produtos que não se encaixam nas categorias acima</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Informações Técnicas */}
            <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                    <Settings className="h-6 w-6" />
                    Informações Técnicas
                </h2>
                <Card>
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-2">
                            <div>
                                <h3 className="font-semibold mb-2">Stack Tecnológica</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Next.js 15+ (App Router)</li>
                                    <li>• TypeScript</li>
                                    <li>• PostgreSQL (Prisma ORM)</li>
                                    <li>• Tailwind CSS</li>
                                    <li>• shadcn/ui</li>
                                    <li>• Lucide Icons</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Recursos Principais</h3>
                                <ul className="space-y-1 text-sm text-muted-foreground">
                                    <li>• Categorização automática de produtos</li>
                                    <li>• Histórico de preços por produto</li>
                                    <li>• Sugestões automáticas de produtos</li>
                                    <li>• Modo escuro/claro</li>
                                    <li>• Interface responsiva</li>
                                    <li>• Exportação/Importação de dados</li>
                                </ul>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
