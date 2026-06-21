import React, { useState } from 'react';
import { useCatalogStore } from '../../store/catalogStore';

export const TextManager: React.FC = () => {
  const texts = useCatalogStore((state) => state.texts);
  const updateTextSettings = useCatalogStore((state) => state.updateTextSettings);

  const [formData, setFormData] = useState({
    nombreArtista: texts?.nombreArtista || '',
    subtitulo: texts?.subtitulo || '',
    textoPresentacion: texts?.textoPresentacion || '',
    tituloCatalogo: texts?.tituloCatalogo || '',
    textoCatalogo: texts?.textoCatalogo || '',
    tituloContacto: texts?.tituloContacto || '',
    textoContacto: texts?.textoContacto || '',
    textoFooter: texts?.textoFooter || '',
    firma: texts?.firma || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    try {
      await updateTextSettings(formData);
      setSaveMessage('Textos actualizados exitosamente.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Error al actualizar textos.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-xl font-medium text-gray-900 mb-6">Textos Principales</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Portada y Presentación</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de Artista</label>
              <input
                type="text"
                name="nombreArtista"
                value={formData.nombreArtista}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ej: Ana Silva"
              />
              <p className="text-xs text-gray-500 mt-1">Si lo dejas vacío, no aparecerá.</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtítulo</label>
              <input
                type="text"
                name="subtitulo"
                value={formData.subtitulo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ej: Arte & Decoración"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Presentación</label>
              <textarea
                name="textoPresentacion"
                value={formData.textoPresentacion}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Escribe algo sobre tu obra..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Catálogo</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Catálogo</label>
              <input
                type="text"
                name="tituloCatalogo"
                value={formData.tituloCatalogo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ej: Catálogo de Obras"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto sobre Catálogo</label>
              <textarea
                name="textoCatalogo"
                value={formData.textoCatalogo}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Texto opcional debajo del título de catálogo..."
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Contacto y Footer</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título de Contacto</label>
              <input
                type="text"
                name="tituloContacto"
                value={formData.tituloContacto}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ej: Contacto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto de Contacto</label>
              <textarea
                name="textoContacto"
                value={formData.textoContacto}
                onChange={handleChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black resize-none"
                placeholder="Ej: Para consultas, escríbeme..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Texto del Footer</label>
              <input
                type="text"
                name="textoFooter"
                value={formData.textoFooter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ej: Todos los derechos reservados."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Firma o Frase Final</label>
              <input
                type="text"
                name="firma"
                value={formData.firma}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Ej: Hecho con ♥"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Guardando...' : 'Guardar Textos'}
          </button>
          {saveMessage && (
            <span className="text-sm text-green-600 font-medium">{saveMessage}</span>
          )}
        </div>
      </form>
    </div>
  );
};
