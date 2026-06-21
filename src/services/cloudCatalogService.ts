/**
 * Cloud Catalog Service — Supabase data operations.
 * Pure data logic, no React components.
 */
import { supabase } from './supabaseClient';
import type { Product, Category, DesignSettings, ContactSettings, SiteTextSettings } from '../types/catalog';

// ─── Helpers ──────────────────────────────────────────────

const throwSupabaseError = (operation: string, table: string, error: any): never => {
  console.error(`[Supabase error] ${operation} on ${table}`, {
    code: error?.code,
    message: error?.message,
    details: error?.details,
    hint: error?.hint,
    status: error?.status,
    full: error,
  });

  throw new Error(
    `${operation} falló en ${table}: ${error?.message || 'Error desconocido'}`
    + (error?.code ? ` | code: ${error.code}` : '')
    + (error?.details ? ` | details: ${error.details}` : '')
    + (error?.hint ? ` | hint: ${error.hint}` : '')
  );
};
/** Map DB snake_case row → app camelCase Product */
const rowToProduct = (row: any): Product => ({
  id: row.id,
  imagenPrincipal: row.imagen_principal ?? undefined,
  galeria: row.galeria ?? undefined,
  titulo: row.titulo ?? undefined,
  precio: row.precio ?? undefined,
  medidas: row.medidas ?? undefined,
  tecnica: row.tecnica ?? undefined,
  ano: row.ano ?? undefined,
  descripcion: row.descripcion ?? undefined,
  estado: row.estado,
  categoriaId: row.categoria_id ?? undefined,
  etiquetas: row.etiquetas ?? undefined,
  orden: row.orden,
  creadoEn: row.creado_en,
  actualizadoEn: row.actualizado_en,
});

/** Map app Product → DB snake_case for insert/update */
const productToRow = (p: Partial<Product> & { id?: string }) => ({
  ...(p.id !== undefined && { id: p.id }),
  ...(p.imagenPrincipal !== undefined && { imagen_principal: p.imagenPrincipal }),
  ...(p.galeria !== undefined && { galeria: p.galeria }),
  ...(p.titulo !== undefined && { titulo: p.titulo }),
  ...(p.precio !== undefined && { precio: p.precio }),
  ...(p.medidas !== undefined && { medidas: p.medidas }),
  ...(p.tecnica !== undefined && { tecnica: p.tecnica }),
  ...(p.ano !== undefined && { ano: p.ano }),
  ...(p.descripcion !== undefined && { descripcion: p.descripcion }),
  ...(p.estado !== undefined && { estado: p.estado }),
  ...(p.categoriaId !== undefined && { categoria_id: p.categoriaId }),
  ...(p.etiquetas !== undefined && { etiquetas: p.etiquetas }),
  ...(p.orden !== undefined && { orden: p.orden }),
  ...(p.creadoEn !== undefined && { creado_en: p.creadoEn }),
  ...(p.actualizadoEn !== undefined && { actualizado_en: p.actualizadoEn }),
});

const rowToCategory = (row: any): Category => ({
  id: row.id,
  nombre: row.nombre,
  activa: row.activa,
  orden: row.orden,
});

const rowToDesign = (row: any): DesignSettings => ({
  imagenPortada: row.imagen_portada ?? undefined,
  imagenFondo: row.imagen_fondo ?? undefined,
  usarFondo: row.usar_fondo ?? false,
  efectoFondo: row.efecto_fondo ?? 'ninguno',
  paleta: row.paleta ?? 'claro',
  estiloGrilla: row.estilo_grilla ?? 'galeria',
  columnasDesktop: row.columnas_desktop ?? 3,
  mostrarHero: row.mostrar_hero ?? true,
  mostrarCategorias: row.mostrar_categorias ?? true,
  mostrarContacto: row.mostrar_contacto ?? true,
  mostrarFooter: row.mostrar_footer ?? true,
});

const rowToContact = (row: any): ContactSettings => ({
  nombre: row.nombre ?? undefined,
  whatsapp: row.whatsapp ?? undefined,
  instagram: row.instagram ?? undefined,
  correo: row.correo ?? undefined,
  mensajeWhatsAppPrellenado: row.mensaje_whatsapp_prellenado ?? undefined,
});

// ─── Products ─────────────────────────────────────────────

export const cloudGetProducts = async (): Promise<Product[]> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('orden', { ascending: true });
  if (error) throwSupabaseError('Get', 'products', error);
  return (data || []).map(rowToProduct);
};

export const cloudCreateProduct = async (product: Product): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('products').insert(productToRow(product));
  if (error) throwSupabaseError('Create', 'products', error);
};

export const cloudUpdateProduct = async (id: string, updates: Partial<Product>): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase
    .from('products')
    .update({ ...productToRow(updates), actualizado_en: new Date().toISOString() })
    .eq('id', id);
  if (error) throwSupabaseError('Update', 'products', error);
};

export const cloudDeleteProduct = async (id: string): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throwSupabaseError('Delete', 'products', error);
};

export const cloudUpdateProductOrder = async (products: { id: string; orden: number }[]): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  for (const p of products) {
    const { error } = await supabase.from('products').update({ orden: p.orden }).eq('id', p.id);
    if (error) throwSupabaseError('Update Order', 'products', error);
  }
};

// ─── Categories ───────────────────────────────────────────

export const cloudGetCategories = async (): Promise<Category[]> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('orden', { ascending: true });
  if (error) throwSupabaseError('Get', 'categories', error);
  return (data || []).map(rowToCategory);
};

export const cloudCreateCategory = async (category: Category): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('categories').insert({
    id: category.id,
    nombre: category.nombre,
    activa: category.activa,
    orden: category.orden,
  });
  if (error) throwSupabaseError('Create', 'categories', error);
};

export const cloudUpdateCategory = async (id: string, updates: Partial<Category>): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('categories').update(updates).eq('id', id);
  if (error) throwSupabaseError('Update', 'categories', error);
};

export const cloudDeleteCategory = async (id: string): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  // Unlink products from category first
  const { error: unlinkErr } = await supabase
    .from('products')
    .update({ categoria_id: null })
    .eq('categoria_id', id);
  if (unlinkErr) throwSupabaseError('Unlink Products', 'categories', unlinkErr);
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throwSupabaseError('Delete', 'categories', error);
};

export const cloudUpdateCategoryOrder = async (categories: { id: string; orden: number }[]): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  for (const c of categories) {
    const { error } = await supabase.from('categories').update({ orden: c.orden }).eq('id', c.id);
    if (error) throwSupabaseError('Update Order', 'categories', error);
  }
};

// ─── Design ───────────────────────────────────────────────

export const cloudGetDesign = async (): Promise<DesignSettings | null> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('design_settings')
    .select('*')
    .eq('id', 'main')
    .single();
  if (error && error.code !== 'PGRST116') throwSupabaseError('Get', 'design_settings', error); // PGRST116 = not found
  return data ? rowToDesign(data) : null;
};

export const cloudSaveDesign = async (settings: DesignSettings): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('design_settings').upsert({
    id: 'main',
    imagen_portada: settings.imagenPortada ?? null,
    imagen_fondo: settings.imagenFondo ?? null,
    usar_fondo: settings.usarFondo,
    efecto_fondo: settings.efectoFondo,
    paleta: settings.paleta,
    estilo_grilla: settings.estiloGrilla,
    columnas_desktop: settings.columnasDesktop,
    mostrar_hero: settings.mostrarHero,
    mostrar_categorias: settings.mostrarCategorias,
    mostrar_contacto: settings.mostrarContacto,
    mostrar_footer: settings.mostrarFooter,
    actualizado_en: new Date().toISOString(),
  });
  if (error) throwSupabaseError('Save', 'design_settings', error);
};

// ─── Contact ──────────────────────────────────────────────

export const cloudGetContact = async (): Promise<ContactSettings | null> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { data, error } = await supabase
    .from('contact_settings')
    .select('*')
    .eq('id', 'main')
    .single();
  if (error && error.code !== 'PGRST116') throwSupabaseError('Get', 'contact_settings', error);
  return data ? rowToContact(data) : null;
};

export const cloudSaveContact = async (settings: ContactSettings): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('contact_settings').upsert({
    id: 'main',
    nombre: settings.nombre ?? null,
    whatsapp: settings.whatsapp ?? null,
    instagram: settings.instagram ?? null,
    correo: settings.correo ?? null,
    mensaje_whatsapp_prellenado: settings.mensajeWhatsAppPrellenado ?? null,
    actualizado_en: new Date().toISOString(),
  });
  if (error) throwSupabaseError('Save', 'contact_settings', error);
};

export const cloudSaveTexts = async (settings: SiteTextSettings): Promise<void> => {
  if (!supabase) throw new Error('Supabase not configured');
  const { error } = await supabase.from('site_texts_settings').upsert({
    id: 'main',
    nombre_artista: settings.nombreArtista ?? null,
    subtitulo: settings.subtitulo ?? null,
    texto_presentacion: settings.textoPresentacion ?? null,
    titulo_catalogo: settings.tituloCatalogo ?? null,
    texto_catalogo: settings.textoCatalogo ?? null,
    titulo_contacto: settings.tituloContacto ?? null,
    texto_contacto: settings.textoContacto ?? null,
    texto_footer: settings.textoFooter ?? null,
    firma: settings.firma ?? null,
    actualizado_en: new Date().toISOString(),
  });
  if (error) throwSupabaseError('Save', 'site_texts_settings', error);
};

// ─── Bulk load ────────────────────────────────────────────

export const cloudLoadAllData = async (): Promise<{
  products: Product[];
  categories: Category[];
  design: DesignSettings;
  contact: ContactSettings;
  texts: SiteTextSettings;
}> => {
  if (!supabase) throw new Error('Supabase not configured');

  const [productsRes, categoriesRes, designRes, contactRes, textsRes] = await Promise.all([
    supabase.from('products').select('*').order('orden', { ascending: true }),
    supabase.from('categories').select('*').order('orden', { ascending: true }),
    supabase.from('design_settings').select('*').eq('id', 'main').single(),
    supabase.from('contact_settings').select('*').eq('id', 'main').single(),
    supabase.from('site_texts_settings').select('*').eq('id', 'main').single(),
  ]);

  const products = (productsRes.data || []).map(rowToProduct);
  const categories = (categoriesRes.data || []).map(rowToCategory);
  const design = designRes.data ? rowToDesign(designRes.data) : null;
  const contact = contactRes.data ? rowToContact(contactRes.data) : null;
  
  const texts: SiteTextSettings | null = textsRes.data ? {
    nombreArtista: textsRes.data.nombre_artista ?? '',
    subtitulo: textsRes.data.subtitulo ?? '',
    textoPresentacion: textsRes.data.texto_presentacion ?? '',
    tituloCatalogo: textsRes.data.titulo_catalogo ?? '',
    textoCatalogo: textsRes.data.texto_catalogo ?? '',
    tituloContacto: textsRes.data.titulo_contacto ?? '',
    textoContacto: textsRes.data.texto_contacto ?? '',
    textoFooter: textsRes.data.texto_footer ?? '',
    firma: textsRes.data.firma ?? '',
  } : null;

  // Import demoData only as last-resort defaults
  const { demoData } = await import('../data/demoData');

  return {
    products,
    categories,
    design: design ?? demoData.design,
    contact: contact ?? demoData.contact,
    texts: texts ?? demoData.texts,
  };
};
