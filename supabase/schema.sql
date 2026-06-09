-- ============================================================
--  COZINHA DA DUDU — Schema completo (Supabase / PostgreSQL)
--  Como usar:
--    1. Abra o seu projeto no Supabase
--    2. Vá em "SQL Editor" → "New query"
--    3. Cole TODO este arquivo e clique em "Run"
--  Pode rodar quantas vezes quiser (é idempotente).
-- ============================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------
-- USERS (cozinheira / dona do app)
-- ----------------------------------------------------------
create table if not exists public.users (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text unique not null,
  phone       text,
  logo_url    text,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------
-- INGREDIENTS (catálogo de ingredientes)
-- ----------------------------------------------------------
create table if not exists public.ingredients (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.users(id) on delete cascade,
  name        text not null,
  unit        text not null check (unit in ('kg','g','l','ml','un','caixa','pacote','bandeja')),
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------
-- DISHES (pratos)
-- ----------------------------------------------------------
create table if not exists public.dishes (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references public.users(id) on delete cascade,
  name          text not null,
  photo_url     text,
  intro         text,
  description   text,
  base_servings integer not null default 10 check (base_servings > 0),
  active        boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ----------------------------------------------------------
-- DISH_INGREDIENTS (ingredientes base de cada prato)
-- ----------------------------------------------------------
create table if not exists public.dish_ingredients (
  id             uuid primary key default gen_random_uuid(),
  dish_id        uuid not null references public.dishes(id) on delete cascade,
  ingredient_id  uuid references public.ingredients(id) on delete set null,
  name           text not null,
  quantity       numeric not null check (quantity > 0),
  unit           text not null check (unit in ('kg','g','l','ml','un','caixa','pacote','bandeja')),
  created_at     timestamptz not null default now()
);

-- ----------------------------------------------------------
-- MENU_LINKS (links de cardápio compartilháveis)
-- ----------------------------------------------------------
create table if not exists public.menu_links (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.users(id) on delete cascade,
  slug             text unique not null,
  title            text not null,
  welcome_message  text,
  validity_days    integer not null check (validity_days in (1,3,7,15,30)),
  created_at       timestamptz not null default now(),
  expires_at       timestamptz not null
);

-- ----------------------------------------------------------
-- MENU_LINK_DISHES (pratos incluídos em cada link)
-- ----------------------------------------------------------
create table if not exists public.menu_link_dishes (
  id            uuid primary key default gen_random_uuid(),
  menu_link_id  uuid not null references public.menu_links(id) on delete cascade,
  dish_id       uuid not null references public.dishes(id) on delete cascade,
  unique (menu_link_id, dish_id)
);

-- ----------------------------------------------------------
-- CUSTOMERS (clientes que fazem pedido)
-- ----------------------------------------------------------
create table if not exists public.customers (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  phone       text not null,
  created_at  timestamptz not null default now()
);

-- ----------------------------------------------------------
-- ORDERS (pedidos)
-- ----------------------------------------------------------
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references public.users(id) on delete set null,
  menu_link_id   uuid references public.menu_links(id) on delete set null,
  customer_id    uuid references public.customers(id) on delete set null,
  customer_name  text not null,
  customer_phone text not null,
  notes          text,
  labor_cost     numeric not null default 0,
  status         text not null default 'FINALIZADO' check (status in ('FINALIZADO')),
  created_at     timestamptz not null default now()
);

-- ----------------------------------------------------------
-- ORDER_DISHES (pratos escolhidos no pedido + nº de pessoas)
-- ----------------------------------------------------------
create table if not exists public.order_dishes (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  dish_id    uuid references public.dishes(id) on delete set null,
  dish_name  text not null,
  servings   integer not null check (servings > 0)
);

-- ----------------------------------------------------------
-- SHOPPING_LISTS (lista de compras consolidada de um pedido)
-- ----------------------------------------------------------
create table if not exists public.shopping_lists (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid not null references public.orders(id) on delete cascade,
  created_at  timestamptz not null default now(),
  unique (order_id)
);

-- ----------------------------------------------------------
-- SHOPPING_LIST_ITEMS (itens da lista de compras)
-- ----------------------------------------------------------
create table if not exists public.shopping_list_items (
  id                uuid primary key default gen_random_uuid(),
  shopping_list_id  uuid not null references public.shopping_lists(id) on delete cascade,
  name              text not null,
  quantity          numeric not null check (quantity >= 0),
  unit              text not null check (unit in ('kg','g','l','ml','un','caixa','pacote','bandeja')),
  manual            boolean not null default false
);

-- ----------------------------------------------------------
-- Índices úteis
-- ----------------------------------------------------------
create index if not exists idx_dishes_user           on public.dishes(user_id);
create index if not exists idx_dish_ingredients_dish on public.dish_ingredients(dish_id);
create index if not exists idx_menu_links_slug        on public.menu_links(slug);
create index if not exists idx_menu_link_dishes_link  on public.menu_link_dishes(menu_link_id);
create index if not exists idx_orders_user            on public.orders(user_id);
create index if not exists idx_order_dishes_order     on public.order_dishes(order_id);
create index if not exists idx_sli_list               on public.shopping_list_items(shopping_list_id);

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================
alter table public.users               enable row level security;
alter table public.ingredients         enable row level security;
alter table public.dishes              enable row level security;
alter table public.dish_ingredients    enable row level security;
alter table public.menu_links          enable row level security;
alter table public.menu_link_dishes    enable row level security;
alter table public.customers           enable row level security;
alter table public.orders              enable row level security;
alter table public.order_dishes        enable row level security;
alter table public.shopping_lists      enable row level security;
alter table public.shopping_list_items enable row level security;

-- ------------------------------------------------------------
-- LEITURA PÚBLICA: cardápios e pratos (o cliente acessa sem login)
-- ------------------------------------------------------------
drop policy if exists "public read dishes" on public.dishes;
create policy "public read dishes" on public.dishes
  for select using (true);

drop policy if exists "public read dish_ingredients" on public.dish_ingredients;
create policy "public read dish_ingredients" on public.dish_ingredients
  for select using (true);

drop policy if exists "public read ingredients" on public.ingredients;
create policy "public read ingredients" on public.ingredients
  for select using (true);

drop policy if exists "public read menu_links" on public.menu_links;
create policy "public read menu_links" on public.menu_links
  for select using (true);

drop policy if exists "public read menu_link_dishes" on public.menu_link_dishes;
create policy "public read menu_link_dishes" on public.menu_link_dishes
  for select using (true);

-- ------------------------------------------------------------
-- CLIENTE PODE ENVIAR PEDIDO (insert público)
-- ------------------------------------------------------------
drop policy if exists "public insert customers" on public.customers;
create policy "public insert customers" on public.customers
  for insert with check (true);

drop policy if exists "public insert orders" on public.orders;
create policy "public insert orders" on public.orders
  for insert with check (true);

drop policy if exists "public insert order_dishes" on public.order_dishes;
create policy "public insert order_dishes" on public.order_dishes
  for insert with check (true);

drop policy if exists "public insert shopping_lists" on public.shopping_lists;
create policy "public insert shopping_lists" on public.shopping_lists
  for insert with check (true);

drop policy if exists "public insert shopping_list_items" on public.shopping_list_items;
create policy "public insert shopping_list_items" on public.shopping_list_items
  for insert with check (true);

-- ============================================================
--  MODO ATUAL (sem login): o app usa a ANON KEY para gerenciar.
--  As policies abaixo liberam o painel admin (criar/editar/excluir).
--  >>> Quando você ativar o Supabase Auth, REMOVA o bloco abaixo
--      e use o bloco "COM AUTENTICAÇÃO" mais no fim deste arquivo.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'users','ingredients','dishes','dish_ingredients','menu_links',
    'menu_link_dishes','customers','orders','order_dishes',
    'shopping_lists','shopping_list_items'
  ] loop
    execute format('drop policy if exists "anon manage %1$s" on public.%1$s;', t);
    execute format($f$
      create policy "anon manage %1$s" on public.%1$s
        for all using (true) with check (true);
    $f$, t);
  end loop;
end $$;

-- ============================================================
--  (FUTURO) BLOCO COM AUTENTICAÇÃO — deixe comentado por enquanto.
--  Quando ligar o Supabase Auth, troque o bloco "MODO ATUAL" por este:
--
--  create policy "owner manage dishes" on public.dishes
--    for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
--  -- (repita o padrão para as demais tabelas do dono)
-- ============================================================
