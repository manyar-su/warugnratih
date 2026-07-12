create extension if not exists pgcrypto;

create table if not exists public.warung_ratih_sites (
  id uuid primary key default gen_random_uuid(),
  site_code text not null unique,
  site_name text not null,
  domain text,
  location_label text,
  whatsapp_number text,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.warung_ratih_site_settings (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, setting_key)
);

create table if not exists public.warung_ratih_hero_sections (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  eyebrow text,
  price_badge text,
  title_lead text,
  title_accent text,
  description text,
  primary_cta_label text,
  secondary_cta_label text,
  hero_image_url text,
  background_image_url text,
  stats jsonb not null default '[]'::jsonb,
  features jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id)
);

create table if not exists public.warung_ratih_categories (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  category_slug text not null,
  category_name text not null,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, category_slug)
);

create table if not exists public.warung_ratih_menu_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  category_id uuid references public.warung_ratih_categories(id) on delete set null,
  sku text,
  item_slug text not null,
  item_name text not null,
  description text,
  price integer not null default 0,
  image_url text,
  layout text not null default 'normal' check (layout in ('normal', 'wide', 'tall')),
  option_type text not null default 'default' check (option_type in ('default', 'seblak', 'kopi', 'rokok')),
  options jsonb not null default '{}'::jsonb,
  is_available boolean not null default true,
  is_best_seller boolean not null default false,
  has_age_restriction boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, item_slug),
  unique (site_id, sku)
);

create table if not exists public.warung_ratih_menu_item_media (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  menu_item_id uuid not null references public.warung_ratih_menu_items(id) on delete cascade,
  media_label text,
  media_url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.warung_ratih_promos (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  promo_slug text not null,
  promo_name text not null,
  description text,
  promo_price integer not null default 0,
  original_price integer not null default 0,
  image_url text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, promo_slug)
);

create table if not exists public.warung_ratih_promo_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  promo_id uuid not null references public.warung_ratih_promos(id) on delete cascade,
  menu_item_id uuid references public.warung_ratih_menu_items(id) on delete set null,
  item_label text not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);

create table if not exists public.warung_ratih_site_assets (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  asset_group text not null check (asset_group in ('hero', 'menu', 'promo', 'logo', 'banner', 'other')),
  asset_key text not null,
  asset_label text not null,
  storage_bucket text,
  storage_path text,
  public_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  unique (site_id, asset_group, asset_key)
);

create table if not exists public.warung_ratih_orders (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  order_code text not null,
  customer_name text not null,
  customer_phone text not null,
  delivery_method text not null check (delivery_method in ('Ambil Sendiri', 'Pesan Antar')),
  address text,
  landmark text,
  delivery_fee integer not null default 0,
  discount integer not null default 0,
  payment_method text not null check (payment_method in ('Tunai', 'Transfer Bank', 'E-wallet')),
  status text not null default 'Menunggu Konfirmasi' check (
    status in (
      'Menunggu Konfirmasi',
      'Pesanan Diterima',
      'Sedang Dibuat',
      'Siap Diambil',
      'Sedang Diantar',
      'Selesai',
      'Dibatalkan'
    )
  ),
  subtotal integer not null default 0,
  total integer not null default 0,
  notes text,
  ordered_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (site_id, order_code)
);

create table if not exists public.warung_ratih_order_items (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.warung_ratih_sites(id) on delete cascade,
  order_id uuid not null references public.warung_ratih_orders(id) on delete cascade,
  menu_item_id uuid references public.warung_ratih_menu_items(id) on delete set null,
  item_name text not null,
  unit_price integer not null default 0,
  quantity integer not null default 1,
  selected_level text,
  selected_toppings jsonb not null default '[]'::jsonb,
  selected_temp text,
  selected_sweetness text,
  notes text,
  subtotal integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_warung_ratih_categories_site_id
  on public.warung_ratih_categories(site_id, sort_order);

create index if not exists idx_warung_ratih_menu_items_site_id
  on public.warung_ratih_menu_items(site_id, category_id, sort_order);

create index if not exists idx_warung_ratih_promos_site_id
  on public.warung_ratih_promos(site_id, sort_order);

create index if not exists idx_warung_ratih_orders_site_id
  on public.warung_ratih_orders(site_id, ordered_at desc);

create index if not exists idx_warung_ratih_assets_site_id
  on public.warung_ratih_site_assets(site_id, asset_group, sort_order);

insert into public.warung_ratih_sites (
  site_code,
  site_name,
  domain,
  location_label,
  whatsapp_number,
  status
)
values (
  'warung-ratih',
  'Warung Ratih',
  'warung-ratih.vercel.app',
  'Perum Kharisma, Tasikmalaya',
  '6281932018669',
  'draft'
)
on conflict (site_code) do update
set
  site_name = excluded.site_name,
  domain = excluded.domain,
  location_label = excluded.location_label,
  whatsapp_number = excluded.whatsapp_number,
  updated_at = now();
