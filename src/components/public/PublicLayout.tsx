import React from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import PublicHeader from './PublicHeader';
import PublicFooter from './PublicFooter';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const { design } = useCatalogStore();

  const getPaletteClasses = () => {
    switch (design.paleta) {
      case 'oscuro': return 'bg-gray-900 text-gray-100';
      case 'calido': return 'bg-stone-50 text-stone-800';
      case 'editorial': return 'bg-white text-black';
      case 'claro':
      default: return 'bg-white text-gray-800';
    }
  };

  const getBackgroundStyle = () => {
    if (!design.usarFondo || !design.imagenFondo) return {};
    return {
      backgroundImage: `url(${design.imagenFondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: design.efectoFondo === 'parallax' ? 'fixed' : 'scroll',
    };
  };

  return (
    <div className={`min-h-screen flex flex-col font-light ${getPaletteClasses()}`}>
      {design.usarFondo && design.imagenFondo && (
        <div 
          className={`fixed inset-0 z-0 pointer-events-none ${design.efectoFondo === 'blur' ? 'blur-sm' : ''} ${design.efectoFondo === 'gradiente' ? 'opacity-50' : 'opacity-20'}`}
          style={getBackgroundStyle()}
        />
      )}
      
      <div className="relative z-10 flex-grow flex flex-col">
        <PublicHeader />
        <main className="flex-grow">
          {children}
        </main>
        {design.mostrarFooter && <PublicFooter />}
      </div>
    </div>
  );
};

export default PublicLayout;
