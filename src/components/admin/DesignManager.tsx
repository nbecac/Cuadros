import React, { useState, useEffect } from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import type { DesignSettings } from '../../types/catalog';
import ImageUploader from './ImageUploader';

const DesignManager: React.FC = () => {
  const { design, updateDesignSettings } = useCatalogStore();
  const [formData, setFormData] = useState<DesignSettings>(design);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(design);
  }, [design]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateDesignSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Configuración de Diseño</h2>
        {saved && <span className="text-green-600 text-sm font-medium">¡Cambios guardados!</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Basic Info was moved to TextManager */}

        {/* Layout & Style */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Apariencia</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Paleta de Colores</label>
              <select name="paleta" value={formData.paleta} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                <option value="claro">Claro (Blanco puro)</option>
                <option value="calido">Cálido (Tonos arena/crema)</option>
                <option value="oscuro">Oscuro (Elegante negro)</option>
                <option value="editorial">Editorial (Blanco y Negro contraste)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estilo de Grilla (Obras)</label>
              <select name="estiloGrilla" value={formData.estiloGrilla} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                <option value="galeria">Galería (Cuadrícula uniforme)</option>
                <option value="masonry">Masonry (Mosaico dinámico)</option>
                <option value="minimalista">Minimalista (Espacios amplios)</option>
                <option value="editorial">Editorial (Imágenes grandes)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Columnas Desktop</label>
              <input
                type="number"
                name="columnasDesktop"
                min="1" max="6"
                value={formData.columnasDesktop}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
        </section>

        {/* Media */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Imágenes Generales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <ImageUploader 
                label="Imagen de Portada (Hero)"
                value={formData.imagenPortada}
                onChange={(url) => setFormData(prev => ({ ...prev, imagenPortada: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, imagenPortada: undefined }))}
              />
            </div>
            <div>
              <ImageUploader 
                label="Imagen de Fondo"
                value={formData.imagenFondo}
                onChange={(url) => setFormData(prev => ({ ...prev, imagenFondo: url }))}
                onRemove={() => setFormData(prev => ({ ...prev, imagenFondo: undefined }))}
              />
            </div>
          </div>
        </section>

        {/* Visibility Toggles */}
        <section className="bg-gray-50 p-6 rounded-lg border">
          <h3 className="text-lg font-medium mb-4">Elementos Visibles</h3>
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="mostrarHero" checked={formData.mostrarHero} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded border-gray-300" />
              <span className="text-gray-700 font-medium">Mostrar sección de Portada (Hero)</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="mostrarCategorias" checked={formData.mostrarCategorias} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded border-gray-300" />
              <span className="text-gray-700 font-medium">Mostrar menú de Categorías</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="mostrarContacto" checked={formData.mostrarContacto} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded border-gray-300" />
              <span className="text-gray-700 font-medium">Mostrar sección de Contacto</span>
            </label>
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="mostrarFooter" checked={formData.mostrarFooter} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded border-gray-300" />
              <span className="text-gray-700 font-medium">Mostrar Footer de contacto</span>
            </label>
            
            <hr className="my-4" />
            
            <label className="flex items-center space-x-3">
              <input type="checkbox" name="usarFondo" checked={formData.usarFondo} onChange={handleChange} className="h-5 w-5 text-blue-600 rounded border-gray-300" />
              <span className="text-gray-700 font-medium">Activar imagen de fondo en toda la web</span>
            </label>
            
            {formData.usarFondo && (
              <div className="ml-8 mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Efecto del fondo</label>
                <select name="efectoFondo" value={formData.efectoFondo} onChange={handleChange} className="w-full max-w-xs px-3 py-2 border rounded-md">
                  <option value="ninguno">Normal (suave)</option>
                  <option value="blur">Desenfocado</option>
                  <option value="gradiente">Semi-transparente</option>
                  <option value="parallax">Parallax (fijo)</option>
                </select>
              </div>
            )}
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Guardar Diseño
          </button>
        </div>
      </form>
    </div>
  );
};

export default DesignManager;
