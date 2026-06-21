-- ─── DATOS INICIALES (SEED) ──────────────────────────────────

-- 1. Categorías básicas
insert into public.categories (id, nombre, activa, orden) values
  ('11111111-1111-1111-1111-111111111111', 'Cuadros', true, 1),
  ('22222222-2222-2222-2222-222222222222', 'Cojines', true, 2),
  ('33333333-3333-3333-3333-333333333333', 'Vendidos', false, 3);

-- 2. Diseño inicial elegante
insert into public.design_settings (
  id, nombre_artista, texto_presentacion, usar_fondo, efecto_fondo, paleta, estilo_grilla, columnas_desktop, mostrar_hero, mostrar_categorias, mostrar_footer
) values (
  'main',
  'Nombre de la Artista',
  'Explorando la belleza a través de formas, colores y texturas. Cada obra es una pieza única, creada con pasión y dedicación para dar vida a tus espacios.',
  false,
  'ninguno',
  'claro',
  'galeria',
  3,
  true,
  true,
  true
);

-- 3. Contacto inicial
insert into public.contact_settings (
  id, nombre, whatsapp, instagram, correo, texto_contacto, mensaje_whatsapp_prellenado
) values (
  'main',
  'Contacto Artista',
  '+56900000000',
  '@artista_instagram',
  'contacto@artista.com',
  'Para consultas, encargos o reservas, no dudes en escribirme.',
  'Hola, me interesa tu trabajo.'
);

-- 4. Algunos productos de demo (opcional)
insert into public.products (
  titulo, precio, medidas, tecnica, ano, descripcion, estado, categoria_id, orden
) values 
(
  'Atardecer en la Costa', '$150.000', '80x60 cm', 'Óleo sobre lienzo', '2023', 'Una pintura vibrante inspirada en las costas del sur. Colores cálidos y textura profunda.', 'disponible', '11111111-1111-1111-1111-111111111111', 1
),
(
  'Abstracción N° 4', '$120.000', '50x50 cm', 'Acrílico', '2024', 'Exploración de formas geométricas y colores puros.', 'vendido', '11111111-1111-1111-1111-111111111111', 2
),
(
  'Cojín Botánico', '$25.000', '45x45 cm', 'Estampado textil', '2024', '', 'disponible', '22222222-2222-2222-2222-222222222222', 3
);
