create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  name text not null,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.orders (
  id text primary key,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
create table if not exists public.store_settings (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists public.customers (
  id uuid primary key,
  email text unique not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.store_settings enable row level security;
alter table public.customers enable row level security;
create policy "Public catalog read" on public.products for select using (true);
-- Orders, settings and customers intentionally have no public policies.
-- Server-side service-role requests bypass RLS.
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists products_slug_idx on public.products(slug);
