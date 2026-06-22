import React, { useState, useEffect, useRef } from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import type { Product, ProductStatus } from '../../types/catalog';
import { generateId } from '../../utils/id';
import ImageUploader from './ImageUploader';
import { uploadImage } from '../../services/cloudImageService';
import { Loader2 } from 'lucide-react';

interface ProductEditorProps {
  productId: string | null;
  onClose: () => void;
}

const ProductEditor: React.FC<ProductEditorProps> = ({ productId, onClose }) => {
  const { products, categories, addProduct, updateProduct } = useCatalogStore();
  const existingProduct = productId ? products.find(p => p.id === productId) : null;

  const [formData, setFormData] = useState<Partial<Product>>({
    titulo: '',
    precio: '',
    medidas: '',
    tecnica: '',
    ano: '',
    descripcion: '',
    estado: 'disponible',
    categoriaId: categories.length > 0 ? categories[0].id : undefined,
    imagenPrincipal: undefined,
  });

  const [isUploadingMultiple, setIsUploadingMultiple] = useState(false);
  const multipleFileInputRef = useRef<HTMLInputElement>(null);

  const handleMultipleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploadingMultiple(true);
    try {
      const urls = await Promise.all(
        files
          .filter(f => f.type.startsWith('image/'))
          .map(f => uploadImage(f))
      );
      
      setFormData(prev => ({ 
        ...prev, 
        galeria: [...(prev.galeria || []), ...urls] 
      }));
    } catch (error) {
      console.error('Error uploading multiple images:', error);
      alert('Hubo un error subiendo algunas imágenes.');
    } finally {
      setIsUploadingMultiple(false);
      if (multipleFileInputRef.current) {
        multipleFileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    if (existingProduct) {
      setFormData(existingProduct);
    }
  }, [existingProduct]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const cleanGallery = (formData.galeria || []).filter((url) => url && url.trim() !== '');
    const productDataToSave = {
      ...formData,
      galeria: cleanGallery
    };

    if (existingProduct) {
      updateProduct(existingProduct.id, productDataToSave);
    } else {
      const newProduct: Product = {
        id: generateId(),
        estado: formData.estado as ProductStatus || 'disponible',
        orden: products.length > 0 ? Math.max(...products.map(p => p.orden)) + 1 : 1,
        creadoEn: new Date().toISOString(),
        actualizadoEn: new Date().toISOString(),
        ...productDataToSave
      };
      addProduct(newProduct);
    }
    onClose();
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-xl font-semibold">
          {existingProduct ? 'Editar Obra' : 'Nueva Obra'}
        </h2>
        <div className="space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="text-sm font-medium text-gray-900 mb-3 border-b pb-2">Imagen Principal</h3>
            <ImageUploader 
              label=""
              value={formData.imagenPrincipal}
              onChange={(url) => setFormData(prev => ({ ...prev, imagenPrincipal: url }))}
              onRemove={() => setFormData(prev => ({ ...prev, imagenPrincipal: undefined }))}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex justify-between items-center mb-3 border-b pb-2">
              <h3 className="text-sm font-medium text-gray-900">Imágenes Extra (Galería)</h3>
              <div className="space-x-2 flex items-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={multipleFileInputRef}
                  onChange={handleMultipleFilesChange}
                  className="hidden"
                />
                <button 
                  onClick={() => multipleFileInputRef.current?.click()}
                  disabled={isUploadingMultiple}
                  className="text-xs bg-white text-gray-800 border border-gray-300 px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-1 disabled:opacity-50"
                >
                  {isUploadingMultiple && <Loader2 className="w-3 h-3 animate-spin" />}
                  Subir varias a la vez
                </button>
                <button 
                  onClick={() => setFormData(prev => ({ ...prev, galeria: [...(prev.galeria || []), ''] }))}
                  className="text-xs bg-black text-white px-2 py-1 rounded hover:bg-gray-800"
                >
                  + Caja vacía
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              {(!formData.galeria || formData.galeria.length === 0) && (
                <p className="text-sm text-gray-500 italic">No hay imágenes extra.</p>
              )}
              {formData.galeria?.map((url, index) => (
                <div key={index} className="flex gap-4 items-start border bg-white p-3 rounded">
                  <div className="flex-1">
                    <ImageUploader 
                      label={`Imagen Extra ${index + 1}`}
                      value={url !== '' ? url : undefined}
                      compact={true}
                      onChange={(newUrl) => {
                        const newGaleria = [...(formData.galeria || [])];
                        newGaleria[index] = newUrl;
                        setFormData(prev => ({ ...prev, galeria: newGaleria }));
                      }}
                      onRemove={() => {
                        const newGaleria = [...(formData.galeria || [])].filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, galeria: newGaleria }));
                      }}
                    />
                  </div>
                  <div className="flex flex-col gap-2 pt-6">
                    <button 
                      onClick={() => {
                        const newGaleria = [...(formData.galeria || [])];
                        if (index > 0) {
                          [newGaleria[index - 1], newGaleria[index]] = [newGaleria[index], newGaleria[index - 1]];
                          setFormData(prev => ({ ...prev, galeria: newGaleria }));
                        }
                      }}
                      disabled={index === 0}
                      className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30"
                      title="Subir"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => {
                        const newGaleria = [...(formData.galeria || [])];
                        if (index < newGaleria.length - 1) {
                          [newGaleria[index + 1], newGaleria[index]] = [newGaleria[index], newGaleria[index + 1]];
                          setFormData(prev => ({ ...prev, galeria: newGaleria }));
                        }
                      }}
                      disabled={index === (formData.galeria?.length || 0) - 1}
                      className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30"
                      title="Bajar"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => {
                        const newGaleria = [...(formData.galeria || [])].filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, galeria: newGaleria }));
                      }}
                      className="p-1 border rounded hover:bg-red-50 text-red-600 border-red-200 mt-2"
                      title="Eliminar esta caja"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej. Atardecer en la Costa"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="text"
                name="precio"
                value={formData.precio || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ej. $150.000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md bg-white"
              >
                <option value="disponible">Disponible</option>
                <option value="vendido">Vendido</option>
                <option value="reservado">Reservado</option>
                <option value="oculto">Oculto</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medidas</label>
              <input
                type="text"
                name="medidas"
                value={formData.medidas || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ej. 80x60 cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Año</label>
              <input
                type="text"
                name="ano"
                value={formData.ano || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Ej. 2024"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Técnica</label>
            <input
              type="text"
              name="tecnica"
              value={formData.tecnica || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej. Óleo sobre lienzo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              name="categoriaId"
              value={formData.categoriaId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md bg-white"
            >
              <option value="">Sin categoría</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion || ''}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          <div className="pt-6 border-t mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Visualización en la web</h3>
            <p className="text-sm text-gray-500 mb-4">Estos ajustes solo cambian cómo se ve la obra en la página, no modifican la imagen original.</p>
            
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño de tarjeta</label>
                  <select
                    name="tamanoTarjeta"
                    value={formData.tamanoTarjeta || 'mediano'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="pequeno">Pequeño</option>
                    <option value="mediano">Mediano</option>
                    <option value="grande">Grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proporción de tarjeta</label>
                  <select
                    name="proporcionTarjeta"
                    value={formData.proporcionTarjeta || 'vertical'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="cuadrada">Cuadrada</option>
                    <option value="vertical">Vertical</option>
                    <option value="horizontal">Horizontal</option>
                    <option value="auto">Automática</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ajuste de imagen</label>
                  <select
                    name="ajusteImagen"
                    value={formData.ajusteImagen || 'cover'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="cover">Recortar para llenar</option>
                    <option value="contain">Mostrar completa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posición de imagen</label>
                  <select
                    name="posicionImagen"
                    value={formData.posicionImagen || 'center'}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md bg-white"
                  >
                    <option value="center">Centro</option>
                    <option value="top">Arriba</option>
                    <option value="bottom">Abajo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tamaño en modal</label>
                <select
                  name="tamanoModal"
                  value={formData.tamanoModal || 'normal'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                >
                  <option value="normal">Normal</option>
                  <option value="grande">Grande</option>
                  <option value="contenido">Contenido</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEditor;
