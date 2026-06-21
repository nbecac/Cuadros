import React from 'react';
import { AlertCircle, Cloud } from 'lucide-react';
import { isSupabaseConfigured } from '../../services/supabaseClient';

const AdminNotice: React.FC = () => {
  const isCloud = isSupabaseConfigured();

  if (isCloud) {
    return (
      <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Cloud className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-green-700 font-medium">
              Modo nube activo: los datos se guardan de forma segura en Supabase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-blue-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-blue-700">
            Modo local activo: los datos se guardan solo en este navegador.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminNotice;
