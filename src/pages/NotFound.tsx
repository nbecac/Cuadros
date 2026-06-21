import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800">
      <h1 className="text-4xl font-light mb-4">404 - Página no encontrada</h1>
      <p className="mb-8 text-gray-500">Lo sentimos, la página que buscas no existe.</p>
      <Link to="/" className="px-6 py-2 border border-gray-300 hover:bg-gray-50 transition-colors">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
