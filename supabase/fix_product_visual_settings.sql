alter table public.products
add column if not exists tamano_tarjeta text default 'mediano';

alter table public.products
add column if not exists proporcion_tarjeta text default 'vertical';

alter table public.products
add column if not exists ajuste_imagen text default 'cover';

alter table public.products
add column if not exists posicion_imagen text default 'center';

alter table public.products
add column if not exists tamano_modal text default 'normal';
