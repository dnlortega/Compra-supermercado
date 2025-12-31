# Google AdSense - Guia de Implementação

## ✅ Script Principal Instalado

O script do Google AdSense foi adicionado ao `app/layout.tsx`:

```tsx
<Script
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8911347909113264"
  crossOrigin="anonymous"
  strategy="afterInteractive"
/>
```

### Configuração:
- **Publisher ID**: `ca-pub-8911347909113264`
- **Strategy**: `afterInteractive` - Carrega após a página ser interativa
- **Async**: Carregamento assíncrono para não bloquear renderização

---

## 📦 Componentes de Anúncios Criados

Arquivo: `components/adsense.tsx`

### 1. **AdSense** (Base Component)
Componente base configurável:

```tsx
import { AdSense } from "@/components/adsense";

<AdSense
  adSlot="1234567890"
  adFormat="auto"
  fullWidthResponsive={true}
  className="my-4"
/>
```

**Props:**
- `adSlot`: ID do slot do anúncio (obtenha no Google AdSense)
- `adFormat`: "auto" | "fluid" | "rectangle" | "vertical" | "horizontal"
- `fullWidthResponsive`: boolean (padrão: true)
- `className`: classes CSS customizadas

---

### 2. **AdSenseResponsive**
Anúncio responsivo padrão:

```tsx
import { AdSenseResponsive } from "@/components/adsense";

<AdSenseResponsive className="my-6" />
```

**Uso recomendado:**
- Entre seções de conteúdo
- No topo ou rodapé de páginas
- Sidebar em desktop

---

### 3. **AdSenseInFeed**
Anúncio para feeds (listas):

```tsx
import { AdSenseInFeed } from "@/components/adsense";

<AdSenseInFeed className="my-4" />
```

**Uso recomendado:**
- Entre itens de lista
- No histórico de compras
- Em feeds de produtos

---

### 4. **AdSenseInArticle**
Anúncio para dentro de artigos:

```tsx
import { AdSenseInArticle } from "@/components/adsense";

<AdSenseInArticle className="my-8" />
```

**Uso recomendado:**
- Dentro de conteúdo longo
- Páginas de detalhes
- Artigos ou tutoriais

---

## 🎯 Onde Colocar Anúncios

### **Locais Estratégicos:**

#### 1. **Página Principal** (`app/page.tsx`)
```tsx
// Após o UserGreeting
<UserGreeting user={user} />
<AdSenseResponsive className="my-6" />

// Entre seções
<section>...</section>
<AdSenseInFeed className="my-4" />
<section>...</section>
```

#### 2. **Histórico de Compras** (`app/history/history-client.tsx`)
```tsx
// Entre grupos de meses
{initialHistory.map((group, index) => (
  <>
    <MonthGroup key={group.month} data={group} />
    {index === 1 && <AdSenseInFeed className="my-4" />}
  </>
))}
```

#### 3. **Lista de Compras** (`app/list/page.tsx`)
```tsx
// Após o formulário de adicionar
<AddProductForm />
<AdSenseResponsive className="my-6" />
<ProductList />
```

#### 4. **Detalhes do Histórico** (`app/history/[id]/page.tsx`)
```tsx
// Após informações da lista
<ListInfo />
<AdSenseInArticle className="my-8" />
<ProductList />
```

---

## ⚙️ Configuração no Google AdSense

### **Passo 1: Criar Unidades de Anúncio**

1. Acesse [Google AdSense](https://www.google.com/adsense)
2. Vá em **Anúncios** → **Por unidade de anúncio**
3. Clique em **Nova unidade de anúncio**

### **Passo 2: Tipos de Anúncios Recomendados**

#### **Display Responsivo**
- Nome: "Banner Principal"
- Tipo: Display responsivo
- Copie o `data-ad-slot`
- Use em: `AdSenseResponsive`

#### **In-feed**
- Nome: "Feed Histórico"
- Tipo: In-feed
- Copie o `data-ad-slot`
- Use em: `AdSenseInFeed`

#### **In-article**
- Nome: "Artigo Detalhes"
- Tipo: In-article
- Copie o `data-ad-slot`
- Use em: `AdSenseInArticle`

### **Passo 3: Atualizar Componentes**

Substitua `YOUR_AD_SLOT_ID` nos componentes:

```tsx
// components/adsense.tsx
export function AdSenseResponsive({ className = "" }: { className?: string }) {
    return (
        <AdSense
            adSlot="1234567890" // ← Cole seu slot ID aqui
            adFormat="auto"
            fullWidthResponsive={true}
            className={className}
        />
    );
}
```

---

## 🎨 Estilização

### **CSS Customizado** (opcional)
```css
/* app/globals.css */
.adsense-container {
  margin: 1.5rem 0;
  padding: 1rem;
  background: var(--muted);
  border-radius: 0.5rem;
  min-height: 100px;
}

.adsense-container ins {
  display: block;
  text-align: center;
}
```

### **Classes Tailwind**
```tsx
<AdSenseResponsive className="my-6 p-4 bg-muted rounded-lg" />
```

---

## 📊 Melhores Práticas

### ✅ **Fazer:**
1. **Posicionamento Natural**: Coloque anúncios onde fazem sentido
2. **Espaçamento Adequado**: Use `my-4` ou `my-6` para separar do conteúdo
3. **Responsividade**: Use `fullWidthResponsive={true}`
4. **Limite de Anúncios**: Máximo 3 anúncios por página
5. **Above the Fold**: Pelo menos 1 anúncio visível sem scroll

### ❌ **Evitar:**
1. **Excesso de Anúncios**: Não sobrecarregue a página
2. **Anúncios Enganosos**: Não disfarce como conteúdo
3. **Bloqueio de Conteúdo**: Não cubra elementos importantes
4. **Cliques Acidentais**: Mantenha distância de botões
5. **Páginas Vazias**: Não coloque anúncios em páginas sem conteúdo

---

## 🔍 Monitoramento

### **Google AdSense Dashboard**
- Acompanhe impressões
- Verifique CTR (Click-Through Rate)
- Analise receita
- Otimize posicionamento

### **Métricas Importantes:**
- **Impressões**: Quantas vezes o anúncio foi exibido
- **Cliques**: Quantas vezes foi clicado
- **CTR**: Taxa de cliques (Cliques ÷ Impressões)
- **CPC**: Custo por clique
- **RPM**: Receita por mil impressões

---

## 🚀 Exemplo de Implementação Completa

### **Página Principal com Anúncios**
```tsx
// app/page.tsx
import { AdSenseResponsive, AdSenseInFeed } from "@/components/adsense";

export default async function Home() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto pb-24">
      <UserGreeting user={user} />
      
      {/* Anúncio após saudação */}
      <AdSenseResponsive className="my-6" />

      <section className="grid gap-4 sm:grid-cols-2">
        {/* Cards de estatísticas */}
      </section>

      <section className="space-y-4">
        <h2>Ações Rápidas</h2>
        {/* Botões de ação */}
      </section>

      {/* Anúncio entre seções */}
      <AdSenseInFeed className="my-4" />

      <section className="space-y-4">
        <h2>Últimas Compras</h2>
        {/* Lista de compras */}
      </section>
    </div>
  );
}
```

---

## 📱 Responsividade

Os anúncios são automaticamente responsivos quando `fullWidthResponsive={true}`:

- **Mobile**: Anúncios se adaptam à largura da tela
- **Tablet**: Tamanho intermediário
- **Desktop**: Largura máxima otimizada

---

## ⚠️ Políticas do Google AdSense

### **Conteúdo Permitido:**
✅ Aplicativos de produtividade  
✅ Listas de compras  
✅ Ferramentas úteis  

### **Conteúdo Proibido:**
❌ Conteúdo adulto  
❌ Violência  
❌ Drogas/álcool  
❌ Conteúdo enganoso  

### **Comportamento Proibido:**
❌ Clicar nos próprios anúncios  
❌ Pedir para outros clicarem  
❌ Ocultar anúncios  
❌ Modificar código do anúncio  

---

## 🛠️ Troubleshooting

### **Anúncios não aparecem?**

1. **Aguarde aprovação**: Pode levar 24-48h
2. **Verifique console**: Procure erros JavaScript
3. **Teste em produção**: Anúncios podem não aparecer em localhost
4. **Verifique AdBlocker**: Desative para testar

### **Anúncios em branco?**

1. **Slot ID correto?**: Verifique o `data-ad-slot`
2. **Script carregado?**: Verifique Network tab
3. **Conteúdo aprovado?**: Revise políticas do AdSense

---

## 📈 Otimização de Receita

### **Dicas:**

1. **Teste A/B**: Experimente diferentes posições
2. **Heatmap**: Use ferramentas para ver onde usuários clicam
3. **Analytics**: Integre com Google Analytics
4. **Auto Ads**: Considere ativar anúncios automáticos
5. **Tamanhos**: Teste diferentes formatos de anúncio

---

**Data**: 31/12/2024  
**Autor**: Antigravity AI  
**Status**: ✅ Google AdSense Configurado  
**Publisher ID**: ca-pub-8911347909113264
