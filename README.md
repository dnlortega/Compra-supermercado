# Controle de Supermercado 🛒

Sistema web responsivo para controle de compras de mercado built with Next.js, shadcn/ui and PostgreSQL (Neon).

## 🚀 Como rodar o projeto

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configuração do Banco de Dados:**
    O projeto já está configurado com o banco Neon.
    Certifique-se de que o arquivo `.env` contém a URL do banco.
    ```bash
    npx prisma db push
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

4.  **Acesse:** [http://localhost:3000](http://localhost:3000)

## 📱 Funcionalidades

- **Criar Lista:** Adicione itens e quantidades.
- **Preencher Valores:** Checklist para inserir preços unitários durante a compra.
- **Resumo:** Veja o total gasto e detalhes por item.
