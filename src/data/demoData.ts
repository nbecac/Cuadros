import type { CatalogData } from '../types/catalog';
import { generateId } from '../utils/id';

export const demoData: CatalogData = {
  products: [
    {
      id: generateId(),
      titulo: 'Atardecer en la Costa',
      precio: '$150.000',
      medidas: '80x60 cm',
      tecnica: 'Óleo sobre lienzo',
      ano: '2023',
      descripcion: 'Una pintura vibrante inspirada en las costas del sur. Colores cálidos y textura profunda.',
      estado: 'disponible',
      orden: 1,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      categoriaId: 'cat1',
      // Using CSS gradient placeholder as default
    },
    {
      id: generateId(),
      titulo: 'Abstracción N° 4',
      precio: '$120.000',
      medidas: '50x50 cm',
      tecnica: 'Acrílico',
      ano: '2024',
      descripcion: 'Exploración de formas geométricas y colores puros.',
      estado: 'vendido',
      orden: 2,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      categoriaId: 'cat1',
    },
    {
      id: generateId(),
      titulo: 'Cojín Botánico',
      precio: '$25.000',
      medidas: '45x45 cm',
      tecnica: 'Estampado textil',
      estado: 'disponible',
      orden: 3,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      categoriaId: 'cat2',
    }
  ],
  categories: [
    {
      id: 'cat1',
      nombre: 'Cuadros',
      activa: true,
      orden: 1,
    },
    {
      id: 'cat2',
      nombre: 'Cojines',
      activa: true,
      orden: 2,
    },
    {
      id: 'cat3',
      nombre: 'Vendidos',
      activa: false,
      orden: 3,
    }
  ],
  design: {
    usarFondo: false,
    efectoFondo: 'ninguno',
    paleta: 'claro',
    estiloGrilla: 'galeria',
    columnasDesktop: 3,
    mostrarHero: true,
    mostrarCategorias: true,
    mostrarContacto: true,
    mostrarFooter: true,
  },
  texts: {
    nombreArtista: 'Nombre de la Artista',
    subtitulo: 'Arte & Decoración',
    textoPresentacion: 'Explorando la belleza a través de formas, colores y texturas. Cada obra es una pieza única, creada con pasión y dedicación para dar vida a tus espacios.',
    tituloCatalogo: 'Catálogo de Obras',
    textoCatalogo: '',
    tituloContacto: 'Contacto',
    textoContacto: 'Para consultas, encargos o reservas, no dudes en escribirme.',
    textoFooter: 'Todos los derechos reservados.',
    firma: 'Hecho con ♥',
  },
  contact: {
    nombre: 'Contacto Artista',
    whatsapp: '+56900000000',
    instagram: '@artista_instagram',
    correo: 'contacto@artista.com',
    mensajeWhatsAppPrellenado: 'Hola, me interesa tu trabajo.',
  }
};
