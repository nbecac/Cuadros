import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicCatalog from './pages/PublicCatalog';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import { useCatalogStore } from './store/catalogStore';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isCloud = isSupabaseConfigured();
  const isAuthenticatedLocal = sessionStorage.getItem('admin_auth') === 'true';
  const [authChecked, setAuthChecked] = useState(!isCloud);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (isCloud && supabase) {
      sessionStorage.removeItem('admin_auth');
      
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        setAuthChecked(true);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
      });

      return () => subscription.unsubscribe();
    }
  }, [isCloud]);

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const isCloudAuthenticated = isCloud && session && session.user?.email === adminEmail;
  const isLocalAuthenticated = !isCloud && isAuthenticatedLocal;

  if (!isCloudAuthenticated && !isLocalAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { texts, loadInitialData, loading } = useCatalogStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  useEffect(() => {
    document.title = texts?.nombreArtista || 'Catálogo de Arte';
  }, [texts?.nombreArtista]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen bg-gray-50 text-gray-400">Cargando catálogo...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicCatalog />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
