create extension if not exists "uuid-ossp";

create table if not exists public.site_texts_settings (
  id text primary key,
  nombre_artista text,
  subtitulo text,
  texto_presentacion text,
  titulo_catalogo text,
  texto_catalogo text,
  titulo_contacto text,
  texto_contacto text,
  texto_footer text,
  firma text,
  actualizado_en timestamptz not null default now()
);

alter table public.site_texts_settings enable row level security;

drop policy if exists "Lectura pública de textos" on public.site_texts_settings;
drop policy if exists "Admin tiene acceso total a textos" on public.site_texts_settings;
drop policy if exists "Public can read site texts" on public.site_texts_settings;
drop policy if exists "Authenticated can insert site texts" on public.site_texts_settings;
drop policy if exists "Authenticated can update site texts" on public.site_texts_settings;
drop policy if exists "Authenticated can delete site texts" on public.site_texts_settings;

create policy "Public can read site texts"
on public.site_texts_settings
for select
to anon, authenticated
using (true);

create policy "Authenticated can insert site texts"
on public.site_texts_settings
for insert
to authenticated
with check (true);

create policy "Authenticated can update site texts"
on public.site_texts_settings
for update
to authenticated
using (true)
with check (true);

create policy "Authenticated can delete site texts"
on public.site_texts_settings
for delete
to authenticated
using (true);

grant select on public.site_texts_settings to anon;
grant select, insert, update, delete on public.site_texts_settings to authenticated;
