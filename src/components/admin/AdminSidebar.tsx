import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Image, Layers, Palette, Mail, Database, LogOut, ExternalLink, FileText } from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const navItems = [
  { id: 'textos', label: 'Textos', icon: FileText },
  { id: 'obras', label: 'Obras', icon: Image },
  { id: 'categorias', label: 'Categorías', icon: Layers },
  { id: 'diseno', label: 'Diseño', icon: Palette },
  { id: 'contacto', label: 'Contacto', icon: Mail },
  { id: 'respaldo', label: 'Respaldo', icon: Database },
];

const AdminSidebar: React.FC<AdminSidebarProps> = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    import('../../services/supabaseClient').then(async ({ supabase, isSupabaseConfigured }) => {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
      sessionStorage.removeItem('admin_auth');
      navigate('/admin/login');
    });
  };

  return (
    <div className="w-64 bg-gray-900 text-white hidden lg:flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-semibold tracking-wider">Panel Admin</h2>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                isActive ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ExternalLink className="mr-3 h-5 w-5" />
          Ver sitio
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-red-400 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Salir
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
