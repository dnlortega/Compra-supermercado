# COMPRA FÁCIL 🛒

Sistema completo e responsivo para controle de compras de supermercado, focado em agilidade e organização.

## ✨ Principais Diferenciais

- **MAIÚSCULO POR PADRÃO**: Toda a interface é exibida em letras maiúsculas para facilitar a leitura rápida durante as compras.
- **ENTRADA DE PREÇOS INTELIGENTE**: Preenchimento de valores otimizado (começa pelos centavos e não exige vírgula), agilizando a inserção no PDV ou no corredor.

## 📱 Funcionalidades

- **GESTÃO DE LISTAS**: Adicione itens rapidamente com sugestões automáticas.
- **CATÁLOGO DE PRODUTOS**: Gerencie seus produtos frequentes para criar novas listas em segundos.
- **PREENCHIMENTO EM TEMPO REAL**: Checklist de preços com cálculo automático de subtotal e total.
- **HISTÓRICO E ESTATÍSTICAS**: Visualize suas compras passadas e acompanhe a variação de preços de cada item.
- **MODO ESCURO/CLARO**: Suporte nativo a temas para melhor conforto visual.

## 🛠️ Stack Tecnológica

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) (Hospedado no [Neon DB](https://neon.tech/))
- **ORM**: [Prisma](https://www.prisma.io/)
- **UI/UX**: [shadcn/ui](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
- **Ícones**: [Lucide React](https://lucide.dev/)

## 🚀 Como Rodar o Projeto

### 1. Pré-requisitos
- Node.js instalado.
- Banco de dados PostgreSQL (recomendamos Neon.tech).

### 2. Instalação
```bash
# Clone o repositório e acesse a pasta
git clone <url-do-repositorio>
cd Compra-supermercado

# Instale as dependências
npm install
```

### 3. Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto com a sua URL do banco:
```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

### 4. Banco de Dados
Sincronize o esquema do banco de dados:
```bash
npx prisma db push
```

### 5. Iniciar o Desenvolvimento
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---
Desenvolvido para facilitar o seu dia a dia no mercado! 🍍🥩🧼

## 🧪 Testar fluxo de exclusão (automático)

Existe um script de teste que cria um produto de exemplo, adiciona entradas em `price_history` e um `catalogProduct`, executa a remoção e imprime contagens antes/depois.

Uso:

1. Configure `DATABASE_URL` no seu `.env` (mesma configuração usada pela aplicação).
2. Execute o script:

```powershell
# (no Windows PowerShell)
npm run test-delete-flow
```

Saída esperada (exemplo):

```
--- Test delete flow START ---
Before - products: 1 priceHistory: 2 catalog: 1
Deleted priceHistory entries for TEST_PRODUCT_DELETE
Deleted product id <uuid>
Other products with same name after deletion: 0
Deleted catalogProduct count: 1
After - products: 0 priceHistory: 0 catalog: 0
--- Test delete flow END ---
```

Observações:
- O script usa `@prisma/client` e assume que as migrations/esquema já estão aplicados.
- Não rode em ambientes de produção sem antes revisar os dados que serão criados/excluídos.
