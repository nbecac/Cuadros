import { create } from 'zustand';
import type { CatalogData, Product, Category, DesignSettings, ContactSettings, SiteTextSettings, ProductStatus } from '../types/catalog';
import { loadCatalogData, saveCatalogData } from '../services/storageService';
import { isSupabaseConfigured } from '../services/supabaseClient';
import { demoData } from '../data/demoData';
import * as cloudService from '../services/cloudCatalogService';

interface CatalogState extends CatalogData {
  loading: boolean;
  error: string | null;
  loadInitialData: () => Promise<void>;

  // Product actions
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  hideProduct: (id: string) => Promise<void>;
  setProductStatus: (id: string, status: ProductStatus) => Promise<void>;
  moveProductUp: (id: string) => Promise<void>;
  moveProductDown: (id: string) => Promise<void>;
  setProductCategory: (id: string, categoryId?: string) => Promise<void>;
  
  // Category actions
  addCategory: (category: Category) => Promise<void>;
  updateCategory: (id: string, updates: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  toggleCategory: (id: string) => Promise<void>;
  moveCategoryUp: (id: string) => Promise<void>;
  moveCategoryDown: (id: string) => Promise<void>;

  // Text & Design actions
  updateTextSettings: (settings: Partial<SiteTextSettings>) => Promise<void>;
  updateDesignSettings: (settings: Partial<DesignSettings>) => Promise<void>;
  resetDesignSettings: () => Promise<void>;

  // Contact actions
  updateContactSettings: (settings: Partial<ContactSettings>) => Promise<void>;

  // Global
  importCatalogData: (data: CatalogData) => Promise<void>;
}

const isCloud = isSupabaseConfigured();

export const useCatalogStore = create<CatalogState>((set, get) => {
  
  const updateAndSaveLocal = (updates: Partial<CatalogState>) => {
    set(updates);
    const currentState = get();
    saveCatalogData({
      products: currentState.products,
      categories: currentState.categories,
      design: currentState.design,
      contact: currentState.contact,
      texts: currentState.texts,
    });
  };

  return {
    // Initial static state before loading
    products: [],
    categories: [],
    design: demoData.design,
    contact: demoData.contact,
    texts: demoData.texts,
    loading: true,
    error: null,

    loadInitialData: async () => {
      set({ loading: true, error: null });
      try {
        const data = await loadCatalogData();
        set({ ...data, loading: false });
      } catch (error: any) {
        set({ error: error.message, loading: false });
      }
    },

    addProduct: async (product) => {
      if (isCloud) await cloudService.cloudCreateProduct(product);
      const { products } = get();
      if (isCloud) {
        set({ products: [...products, product] });
      } else {
        updateAndSaveLocal({ products: [...products, product] });
      }
    },
    updateProduct: async (id, updates) => {
      if (isCloud) await cloudService.cloudUpdateProduct(id, updates);
      const { products } = get();
      const newProducts = products.map((p) => (p.id === id ? { ...p, ...updates, actualizadoEn: new Date().toISOString() } : p));
      if (isCloud) {
        set({ products: newProducts });
      } else {
        updateAndSaveLocal({ products: newProducts });
      }
    },
    deleteProduct: async (id) => {
      if (isCloud) await cloudService.cloudDeleteProduct(id);
      const { products } = get();
      const newProducts = products.filter((p) => p.id !== id);
      if (isCloud) {
        set({ products: newProducts });
      } else {
        updateAndSaveLocal({ products: newProducts });
      }
    },
    hideProduct: async (id) => {
      if (isCloud) await cloudService.cloudUpdateProduct(id, { estado: 'oculto' });
      const { products } = get();
      const newProducts = products.map((p) => (p.id === id ? { ...p, estado: 'oculto', actualizadoEn: new Date().toISOString() } : p)) as Product[];
      if (isCloud) set({ products: newProducts }); else updateAndSaveLocal({ products: newProducts });
    },
    setProductStatus: async (id, status) => {
      if (isCloud) await cloudService.cloudUpdateProduct(id, { estado: status });
      const { products } = get();
      const newProducts = products.map((p) => (p.id === id ? { ...p, estado: status, actualizadoEn: new Date().toISOString() } : p)) as Product[];
      if (isCloud) set({ products: newProducts }); else updateAndSaveLocal({ products: newProducts });
    },
    moveProductUp: async (id) => {
      const { products } = get();
      const index = products.findIndex((p) => p.id === id);
      if (index > 0) {
        const newProducts = [...products];
        const temp = newProducts[index - 1].orden;
        newProducts[index - 1].orden = newProducts[index].orden;
        newProducts[index].orden = temp;
        const tempObj = newProducts[index - 1];
        newProducts[index - 1] = newProducts[index];
        newProducts[index] = tempObj;
        
        if (isCloud) {
          await cloudService.cloudUpdateProductOrder([
            { id: newProducts[index - 1].id, orden: newProducts[index - 1].orden },
            { id: newProducts[index].id, orden: newProducts[index].orden }
          ]);
          set({ products: newProducts });
        } else {
          updateAndSaveLocal({ products: newProducts });
        }
      }
    },
    moveProductDown: async (id) => {
      const { products } = get();
      const index = products.findIndex((p) => p.id === id);
      if (index < products.length - 1 && index !== -1) {
        const newProducts = [...products];
        const temp = newProducts[index + 1].orden;
        newProducts[index + 1].orden = newProducts[index].orden;
        newProducts[index].orden = temp;
        const tempObj = newProducts[index + 1];
        newProducts[index + 1] = newProducts[index];
        newProducts[index] = tempObj;

        if (isCloud) {
          await cloudService.cloudUpdateProductOrder([
            { id: newProducts[index + 1].id, orden: newProducts[index + 1].orden },
            { id: newProducts[index].id, orden: newProducts[index].orden }
          ]);
          set({ products: newProducts });
        } else {
          updateAndSaveLocal({ products: newProducts });
        }
      }
    },
    setProductCategory: async (id, categoryId) => {
      if (isCloud) await cloudService.cloudUpdateProduct(id, { categoriaId: categoryId });
      const { products } = get();
      const newProducts = products.map((p) => (p.id === id ? { ...p, categoriaId: categoryId, actualizadoEn: new Date().toISOString() } : p));
      if (isCloud) set({ products: newProducts }); else updateAndSaveLocal({ products: newProducts });
    },

    addCategory: async (category) => {
      if (isCloud) await cloudService.cloudCreateCategory(category);
      const { categories } = get();
      if (isCloud) set({ categories: [...categories, category] }); else updateAndSaveLocal({ categories: [...categories, category] });
    },
    updateCategory: async (id, updates) => {
      if (isCloud) await cloudService.cloudUpdateCategory(id, updates);
      const { categories } = get();
      const newCats = categories.map((c) => (c.id === id ? { ...c, ...updates } : c));
      if (isCloud) set({ categories: newCats }); else updateAndSaveLocal({ categories: newCats });
    },
    deleteCategory: async (id) => {
      if (isCloud) await cloudService.cloudDeleteCategory(id);
      const { categories, products } = get();
      const newCats = categories.filter((c) => c.id !== id);
      const newProds = products.map((p) => (p.categoriaId === id ? { ...p, categoriaId: undefined } : p));
      if (isCloud) set({ categories: newCats, products: newProds }); else updateAndSaveLocal({ categories: newCats, products: newProds });
    },
    toggleCategory: async (id) => {
      const { categories } = get();
      const cat = categories.find(c => c.id === id);
      if (cat) {
        if (isCloud) await cloudService.cloudUpdateCategory(id, { activa: !cat.activa });
        const newCats = categories.map((c) => (c.id === id ? { ...c, activa: !c.activa } : c));
        if (isCloud) set({ categories: newCats }); else updateAndSaveLocal({ categories: newCats });
      }
    },
    moveCategoryUp: async (id) => {
      const { categories } = get();
      const index = categories.findIndex((c) => c.id === id);
      if (index > 0) {
        const newCats = [...categories];
        const temp = newCats[index - 1].orden;
        newCats[index - 1].orden = newCats[index].orden;
        newCats[index].orden = temp;
        const tempObj = newCats[index - 1];
        newCats[index - 1] = newCats[index];
        newCats[index] = tempObj;

        if (isCloud) {
          await cloudService.cloudUpdateCategoryOrder([
            { id: newCats[index - 1].id, orden: newCats[index - 1].orden },
            { id: newCats[index].id, orden: newCats[index].orden }
          ]);
          set({ categories: newCats });
        } else {
          updateAndSaveLocal({ categories: newCats });
        }
      }
    },
    moveCategoryDown: async (id) => {
      const { categories } = get();
      const index = categories.findIndex((c) => c.id === id);
      if (index < categories.length - 1 && index !== -1) {
        const newCats = [...categories];
        const temp = newCats[index + 1].orden;
        newCats[index + 1].orden = newCats[index].orden;
        newCats[index].orden = temp;
        const tempObj = newCats[index + 1];
        newCats[index + 1] = newCats[index];
        newCats[index] = tempObj;

        if (isCloud) {
          await cloudService.cloudUpdateCategoryOrder([
            { id: newCats[index + 1].id, orden: newCats[index + 1].orden },
            { id: newCats[index].id, orden: newCats[index].orden }
          ]);
          set({ categories: newCats });
        } else {
          updateAndSaveLocal({ categories: newCats });
        }
      }
    },

    updateTextSettings: async (settings) => {
      const { texts } = get();
      const newTexts = { ...texts, ...settings };
      if (isCloud) {
        await cloudService.cloudSaveTexts(newTexts);
      }
      if (isCloud) set({ texts: newTexts }); else updateAndSaveLocal({ texts: newTexts });
    },

    updateDesignSettings: async (settings) => {
      const { design } = get();
      const newDesign = { ...design, ...settings };
      if (isCloud) await cloudService.cloudSaveDesign(newDesign);
      if (isCloud) set({ design: newDesign }); else updateAndSaveLocal({ design: newDesign });
    },
    resetDesignSettings: async () => {
      if (isCloud) return; // Reset local solo, en nube no aplica fácilmente sin resetear base de datos
      updateAndSaveLocal({ design: demoData.design });
    },

    updateContactSettings: async (settings) => {
      const { contact } = get();
      const newContact = { ...contact, ...settings };
      if (isCloud) await cloudService.cloudSaveContact(newContact);
      if (isCloud) set({ contact: newContact }); else updateAndSaveLocal({ contact: newContact });
    },

    importCatalogData: async (data) => {
      if (isCloud) {
        // En nube, importCatalogData requeriría subir todo a Supabase
        // Por simplicidad en este paso, la importación masiva en nube podría ser iterativa
        for (const c of data.categories) await cloudService.cloudCreateCategory(c);
        for (const p of data.products) await cloudService.cloudCreateProduct(p);
        await cloudService.cloudSaveDesign(data.design);
        await cloudService.cloudSaveContact(data.contact);
        set(data);
      } else {
        updateAndSaveLocal(data);
      }
    },
  };
});
