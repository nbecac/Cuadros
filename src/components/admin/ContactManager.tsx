import React, { useState, useEffect } from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import type { ContactSettings } from '../../types/catalog';

const ContactManager: React.FC = () => {
  const { contact, updateContactSettings } = useCatalogStore();
  const [formData, setFormData] = useState<ContactSettings>(contact);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFormData(contact);
  }, [contact]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateContactSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Datos de Contacto</h2>
        {saved && <span className="text-green-600 text-sm font-medium">¡Cambios guardados!</span>}
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-gray-50 p-6 rounded-lg border">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Público (Footer)</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej. Contacto Artista"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (con código de país)</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej. +56912345678"
            />
            <p className="mt-1 text-xs text-gray-500">Fundamental para el botón de compra.</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario de Instagram</label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej. @mi_arte"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              name="correo"
              value={formData.correo || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Ej. hola@miarte.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de WhatsApp Prellenado (Base)</label>
          <input
            type="text"
            name="mensajeWhatsAppPrellenado"
            value={formData.mensajeWhatsAppPrellenado || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Ej. Hola, me interesa tu trabajo."
          />
          <p className="mt-1 text-xs text-gray-500">Este mensaje se usa si el cliente hace clic en el WhatsApp del footer. Si hace clic desde una obra, se incluye automáticamente el nombre de la obra.</p>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
          >
            Guardar Contacto
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactManager;
