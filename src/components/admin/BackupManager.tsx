import React, { useRef, useState } from 'react';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { exportToJson, importFromJson } from '../../services/backupService';
import { useCatalogStore } from '../../store/catalogStore';
import type { CatalogData } from '../../types/catalog';
import { isSupabaseConfigured } from '../../services/supabaseClient';

const BackupManager: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  const storeState = useCatalogStore();
  const isCloud = isSupabaseConfigured();

  const handleExport = async () => {
    setIsExporting(true);
    setMessage(null);
    try {
      const dataToExport: CatalogData = {
        products: storeState.products,
        categories: storeState.categories,
        design: storeState.design,
        contact: storeState.contact,
        texts: storeState.texts,
      };
      
      exportToJson(dataToExport);
      setMessage({ type: 'success', text: 'Respaldo exportado correctamente' });
    } catch (error) {
      console.error(error);
      setMessage({ type: 'error', text: 'Error al exportar el respaldo' });
    } finally {
      setIsExporting(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm('¿Estás seguro de importar este respaldo? Reemplazará todos los datos actuales.')) {
      setIsImporting(true);
      setMessage(null);
      try {
        const importedData = await importFromJson(file);
        
        storeState.updateDesignSettings(importedData.design);
        storeState.updateContactSettings(importedData.contact);
        storeState.updateTextSettings(importedData.texts);
        
        setMessage({ type: 'success', text: 'Respaldo importado correctamente. Recarga la página para ver todos los cambios.' });
        setTimeout(() => window.location.reload(), 2000);
      } catch (error) {
        console.error(error);
        setMessage({ type: 'error', text: 'El archivo no es válido o está corrupto' });
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } else {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="text-xl font-semibold mb-6">Respaldo y Sistema</h2>

      <div className="mb-8 bg-gray-50 p-4 rounded-lg border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-2">Estado del Sistema</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><strong>Modo:</strong> {isCloud ? 'Nube (Supabase)' : 'Local (Navegador)'}</li>
            <li><strong>Obras:</strong> {storeState.products.length}</li>
            <li><strong>Categorías:</strong> {storeState.categories.length}</li>
            <li><strong>Textos configurados:</strong> {storeState.texts.nombreArtista ? 'Sí' : 'No'}</li>
          </ul>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
        <div className="flex items-start">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Importante</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Los respaldos en formato JSON incluyen obras, categorías y configuraciones de diseño.
                {isCloud 
                  ? ' En modo nube, las imágenes de obras no se exportan en el JSON, solo sus referencias.'
                  : ' En modo local, las imágenes se exportan dentro del JSON, lo que puede hacer que el archivo sea grande.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Export Card */}
        <div className="bg-white border rounded-lg p-6 text-center shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4">
            <Download size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Exportar Respaldo</h3>
          <p className="text-sm text-gray-500 mb-6 flex-grow">
            Descarga un archivo JSON con todos los datos de tu catálogo para tener una copia de seguridad.
          </p>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {isExporting ? 'Exportando...' : 'Descargar JSON'}
          </button>
        </div>

        {/* Import Card */}
        <div className="bg-white border rounded-lg p-6 text-center shadow-sm flex flex-col items-center">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
            <Upload size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Importar Respaldo</h3>
          <p className="text-sm text-gray-500 mb-6 flex-grow">
            Sube un archivo JSON previamente exportado para restaurar tu catálogo.
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="w-full py-2 border-2 border-gray-900 text-gray-900 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isImporting ? 'Importando...' : 'Subir JSON'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImport}
            accept="application/json,.json"
            className="hidden"
          />
        </div>

      </div>

      {!isCloud && (
        <div className="mt-12 pt-8 border-t">
          <h3 className="text-lg font-medium text-red-600 mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Zona de Peligro
          </h3>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div className="mb-4 sm:mb-0 max-w-md">
              <h4 className="text-md font-medium text-red-800">Reiniciar datos locales</h4>
              <p className="text-sm text-red-700 mt-1">
                Esto borrará todos los datos almacenados en este navegador y restaurará el catálogo de prueba. Esta acción no se puede deshacer. Se recomienda exportar un respaldo primero.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('¿ESTÁS SEGURO? Esto borrará todas tus obras, textos y diseño. Esta acción es irreversible.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 whitespace-nowrap"
            >
              Reiniciar Datos
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BackupManager;
