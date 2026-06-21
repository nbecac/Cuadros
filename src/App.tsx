import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicCatalog from './pages/PublicCatalog';
import AdminPage from './pages/AdminPage';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';
import { useCatalogStore } from './store/catalogStore';
import { useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = sessionStorage.getItem('admin_auth') === 'true';
  const isCloud = isSupabaseConfigured();
  const [authChecked, setAuthChecked] = useState(!isCloud);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (isCloud && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session);
        if (!session) {
          sessionStorage.removeItem('admin_auth');
        } else {
          sessionStorage.setItem('admin_auth', 'true');
        }
        setAuthChecked(true);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if (!session) {
          sessionStorage.removeItem('admin_auth');
        }
      });

      return () => subscription.unsubscribe();
    }
  }, [isCloud]);

  if (!authChecked) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!isAuthenticated || (isCloud && !session)) {
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
