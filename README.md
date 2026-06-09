# 🍽️ Cozinha da Dudu

PWA para cozinheiras, buffets e marmitarias. A cozinheira cadastra pratos com
ingredientes base, gera um **link de cardápio compartilhável**, e o cliente
escolhe os pratos e o número de pessoas. O sistema **calcula automaticamente a
lista de compras consolidada** e gera um **PDF profissional**.

## ✨ Funcionalidades

- **Dashboard** com totais de pratos, pedidos, finalizados e links ativos
- **Cadastro de pratos** com foto, introdução, descrição, pessoas atendidas e ingredientes
- **Cálculo proporcional automático** (ex: base 10 pessoas / 2kg → 50 pessoas / 10kg)
- **Links de cardápio** públicos, sem login, com validade (1, 3, 7, 15, 30 dias)
- **Tela pública do cliente** — seleção de pratos + quantidade de pessoas + formulário
- **Consolidação de ingredientes** (mesmo item somado, sem duplicatas)
- **Pedidos** com lista de compras **editável** (alterar/excluir/adicionar/unidade)
- **Mão de obra** somada ao total
- **PDF profissional** com logo, cliente, pratos, lista de compras e valores
- **PWA** instalável (Android, iPhone, Desktop) com manifest, service worker e ícones

## 🧰 Stack

React · TypeScript · Vite · Tailwind CSS · React Router · React Hook Form · Zod ·
Lucide Icons · jsPDF · vite-plugin-pwa · (Supabase preparado)

## 🚀 Começando

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build      # gera /dist
npm run preview
```

## 🔗 Rotas

| Rota | Descrição |
|------|-----------|
| `/` | Dashboard |
| `/pratos` · `/pratos/novo` · `/pratos/:id/editar` | Pratos |
| `/links` | Links de cardápio |
| `/pedidos` · `/pedidos/:id` | Pedidos |
| `/cardapio/:slug` | **Cardápio público (cliente)** |

Cardápio de exemplo já populado: `/cardapio/abc123`

## 🗄️ Dados & Supabase (preparado)

Hoje a app usa **dados mockados + localStorage** através do *Repository Pattern*
(`src/services`). A camada Supabase **já está implementada** — basta ligar:

**1. Criar as tabelas no Supabase**

No painel do seu projeto: **SQL Editor → New query**, cole o conteúdo de
`supabase/schema.sql` e clique em **Run** (cria as 11 tabelas + RLS).
Opcional: rode depois `supabase/seed.sql` para popular com pratos de exemplo.

**2. Configurar as credenciais**

Copie `.env.example` para `.env` e preencha (pegue em *Project Settings → API*):

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

**3. Pronto.** O app detecta as variáveis automaticamente e passa a usar a nuvem.
Se as variáveis ficarem **em branco**, ele volta ao modo local (mock + localStorage).
A troca é automática via `src/services/index.ts` (`DATA_SOURCE`) — a UI não muda.

| Modo | Quando | Onde os dados ficam |
|------|--------|---------------------|
| **local** | `.env` sem credenciais | localStorage do aparelho |
| **supabase** | `.env` preenchido | Banco na nuvem — pedidos dos clientes caem sozinhos |

Tabelas (em `supabase/schema.sql`): `users`, `dishes`, `ingredients`,
`dish_ingredients`, `menu_links`, `menu_link_dishes`, `customers`, `orders`,
`order_dishes`, `shopping_lists`, `shopping_list_items`. RLS: leitura pública de
cardápios/pratos, inserção pública de pedidos, e gestão pela anon key.

## ☁️ Deploy — Cloudflare Pages

- **Build command:** `npm run build`
- **Output directory:** `dist`
- `public/_redirects` já configura o fallback SPA (`/* /index.html 200`)

## 📁 Estrutura

```
src/
  components/  pages/  hooks/  services/  types/
  utils/  contexts/  layouts/  assets/  mock/
public/        # manifest, ícones PWA, logo, _redirects
```

---
Feito com 💚 para a Cozinha da Dudu.
