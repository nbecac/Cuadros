import type { CatalogData } from '../types/catalog';

export const exportToJson = (data: CatalogData): void => {
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `respaldo_catalogo_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importFromJson = (file: File): Promise<CatalogData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content) as any;
        
        // Basic validation
        if (!data || typeof data !== 'object') {
          throw new Error('Archivo inválido: No es un objeto JSON');
        }
        if (!Array.isArray(data.products) || !Array.isArray(data.categories)) {
          throw new Error('Archivo inválido: Estructura de datos incorrecta');
        }
        if (!data.design || !data.contact) {
          throw new Error('Archivo inválido: Faltan configuraciones de diseño o contacto');
        }
        
        // Backward compatibility for old backups
        if (!data.texts) {
          data.texts = {
            nombreArtista: data.design?.nombreArtista || '',
            textoPresentacion: data.design?.textoPresentacion || '',
            tituloCatalogo: 'Catálogo',
            tituloContacto: 'Contacto',
          };
        }
        
        resolve(data as CatalogData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.readAsText(file);
  });
};
