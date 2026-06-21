export type ProductStatus = 'disponible' | 'vendido' | 'reservado' | 'oculto';

export interface Product {
  id: string;
  imagenPrincipal?: string;
  galeria?: string[];
  titulo?: string;
  precio?: string;
  medidas?: string;
  tecnica?: string;
  ano?: string;
  descripcion?: string;
  estado: ProductStatus;
  categoriaId?: string;
  etiquetas?: string[];
  orden: number;
  creadoEn: string;
  actualizadoEn: string;
}

export interface Category {
  id: string;
  nombre: string;
  activa: boolean;
  orden: number;
}

export type DesignPalette = 'claro' | 'calido' | 'oscuro' | 'editorial';
export type DesignGridStyle = 'galeria' | 'masonry' | 'editorial' | 'minimalista';
export type BackgroundEffect = 'ninguno' | 'blur' | 'gradiente' | 'parallax';

export interface SiteTextSettings {
  nombreArtista?: string;
  subtitulo?: string;
  textoPresentacion?: string;
  tituloCatalogo?: string;
  textoCatalogo?: string;
  tituloContacto?: string;
  textoContacto?: string;
  textoFooter?: string;
  firma?: string;
}

export interface DesignSettings {
  imagenPortada?: string;
  imagenFondo?: string;
  usarFondo: boolean;
  efectoFondo: BackgroundEffect;
  paleta: DesignPalette;
  estiloGrilla: DesignGridStyle;
  columnasDesktop: number;
  mostrarHero: boolean;
  mostrarCategorias: boolean;
  mostrarContacto: boolean;
  mostrarFooter: boolean;
}

export interface ContactSettings {
  nombre?: string;
  whatsapp?: string;
  instagram?: string;
  correo?: string;
  mensajeWhatsAppPrellenado?: string;
}

export interface CatalogData {
  products: Product[];
  categories: Category[];
  design: DesignSettings;
  contact: ContactSettings;
  texts: SiteTextSettings;
}
