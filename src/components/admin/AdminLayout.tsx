import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar, { navItems } from './AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, onTabChange }) => {
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
    <div className="min-h-screen bg-gray-100 font-sans text-gray-900 flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <AdminSidebar activeTab={activeTab} onTabChange={onTabChange} />

      {/* Mobile Topbar & Nav */}
      <div className="lg:hidden sticky top-0 z-40 bg-gray-900 border-b border-gray-800 shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-white tracking-wider">Panel Admin</h1>
          <div className="flex gap-2">
            <a 
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-400/10 rounded hover:bg-blue-400/20 transition-colors"
            >
              Ver sitio
            </a>
            <button 
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-red-400 bg-red-400/10 rounded hover:bg-red-400/20 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>

        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 snap-x hide-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center whitespace-nowrap px-3 py-2 text-sm font-medium rounded-md transition-colors snap-start ${
                  isActive ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
