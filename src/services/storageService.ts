import type { CatalogData } from '../types/catalog';
import { demoData } from '../data/demoData';
import { isSupabaseConfigured } from './supabaseClient';
import { cloudLoadAllData } from './cloudCatalogService';

const STORAGE_KEY = 'cuadros-catalog-data-v1';
const OLD_STORAGE_KEY = 'cuadros_catalog_data';

export const saveCatalogData = (data: CatalogData): void => {
  if (isSupabaseConfigured()) return; // Ignoramos local si usamos nube
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    alert('Error al guardar: el almacenamiento local está lleno o bloqueado.');
  }
};

export const loadCatalogData = async (): Promise<CatalogData> => {
  if (isSupabaseConfigured()) {
    try {
      return await cloudLoadAllData();
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      // Fallback a demoData temporal si falla la red, pero idealmente se maneja en el store
      return demoData;
    }
  }

  // Fallback local
  try {
    let saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Intentar migrar desde la clave antigua
      saved = localStorage.getItem(OLD_STORAGE_KEY);
      if (saved) {
        localStorage.setItem(STORAGE_KEY, saved);
        localStorage.removeItem(OLD_STORAGE_KEY);
      }
    }
    
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<CatalogData>;
      // Ensure texts exists for backward compatibility
      return {
        products: parsed.products?.map(p => ({
          ...p,
          estado: p.estado || 'disponible',
          orden: p.orden ?? 0
        })) || [],
        categories: parsed.categories?.map(c => ({
          ...c,
          orden: c.orden ?? 0
        })) || demoData.categories,
        design: parsed.design || demoData.design,
        contact: parsed.contact || demoData.contact,
        texts: parsed.texts || { ...demoData.texts, nombreArtista: (parsed.design as any)?.nombreArtista, textoPresentacion: (parsed.design as any)?.textoPresentacion },
      } as CatalogData;
    }
  } catch (error) {
    console.error('Error loading from localStorage:', error);
  }
  return demoData;
};

export const clearCatalogData = (): void => {
  if (isSupabaseConfigured()) return; // No se aplica
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};
