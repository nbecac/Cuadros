-- Habilitar extensión para UUID
create extension if not exists "uuid-ossp";

-- ─── TABLA PRODUCTS ─────────────────────────────────────────
create table public.products (
  id uuid primary key default uuid_generate_v4(),
  imagen_principal text,
  galeria jsonb,
  titulo text,
  precio text,
  medidas text,
  tecnica text,
  ano text,
  descripcion text,
  estado text not null default 'disponible',
  categoria_id uuid,
  etiquetas jsonb,
  orden integer not null default 0,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- ─── TABLA CATEGORIES ───────────────────────────────────────
create table public.categories (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  activa boolean not null default true,
  orden integer not null default 0
);

-- Relacionar productos con categorías
alter table public.products 
  add constraint fk_products_category 
  foreign key (categoria_id) references public.categories(id) on delete set null;

-- ─── TABLA DESIGN_SETTINGS ──────────────────────────────────
create table public.design_settings (
  id text primary key,
  imagen_portada text,
  imagen_fondo text,
  usar_fondo boolean default false,
  efecto_fondo text default 'ninguno',
  paleta text default 'claro',
  estilo_grilla text default 'galeria',
  columnas_desktop integer default 3,
  mostrar_hero boolean default true,
  mostrar_categorias boolean default true,
  mostrar_contacto boolean default true,
  mostrar_footer boolean default true,
  actualizado_en timestamptz not null default now()
);

-- ─── TABLA CONTACT_SETTINGS ─────────────────────────────────
create table public.contact_settings (
  id text primary key,
  nombre text,
  whatsapp text,
  instagram text,
  correo text,
  mensaje_whatsapp_prellenado text,
  actualizado_en timestamptz not null default now()
);

-- ─── TABLA SITE_TEXTS_SETTINGS ──────────────────────────────
create table public.site_texts_settings (
  id text primary key,
  nombre_artista text,
  subtitulo text,
  texto_presentacion text,
  titulo_catalogo text,
  texto_catalogo text,
  titulo_contacto text,
  footer_texto text,
  actualizado_en timestamptz not null default now()
);

-- ─── SEGURIDAD Y RLS ────────────────────────────────────────

-- Habilitar RLS en todas las tablas
alter table public.products enable row level security;
alter table public.categories enable row level security;
alter table public.design_settings enable row level security;
alter table public.contact_settings enable row level security;
alter table public.site_texts_settings enable row level security;

-- Políticas Lectura (Pública)
create policy "Lectura pública de productos activos" 
  on public.products for select 
  using (estado != 'oculto');

create policy "Lectura pública de categorías activas" 
  on public.categories for select 
  using (activa = true);

create policy "Lectura pública de diseño" 
  on public.design_settings for select 
  using (true);

create policy "Lectura pública de contacto" 
  on public.contact_settings for select 
  using (true);

create policy "Lectura pública de textos" 
  on public.site_texts_settings for select 
  using (true);

-- Políticas Escritura y Lectura Admin (Solo Autenticados)
-- Se asume que cualquier usuario autenticado es admin, ya que solo crearemos 1.
create policy "Admin tiene acceso total a productos" 
  on public.products for all 
  using (auth.role() = 'authenticated');

create policy "Admin tiene acceso total a categorías" 
  on public.categories for all 
  using (auth.role() = 'authenticated');

create policy "Admin tiene acceso total a diseño" 
  on public.design_settings for all 
  using (auth.role() = 'authenticated');

create policy "Admin tiene acceso total a contacto" 
  on public.contact_settings for all 
  using (auth.role() = 'authenticated');

create policy "Admin tiene acceso total a textos" 
  on public.site_texts_settings for all 
  using (auth.role() = 'authenticated');

-- ─── STORAGE (BUCKETS) ──────────────────────────────────────
-- Debes crear manualmente un bucket llamado "catalog-images" desde el panel de Supabase:
-- Storage -> New Bucket -> Name: "catalog-images" -> Activa "Public bucket"

-- Las políticas del bucket deberían ser:
-- 1. Lectura pública (SELECT) para anon o público general.
-- 2. ALL (INSERT, UPDATE, DELETE, SELECT) para authenticated.
