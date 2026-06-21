import React from 'react';
import { useCatalogStore } from '../../store/catalogStore';

const HeroSection: React.FC = () => {
  const { design, texts } = useCatalogStore();

  if (!design.mostrarHero || (!design.imagenPortada && !texts?.textoPresentacion)) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
      {design.imagenPortada && (
        <div className="mb-8 overflow-hidden flex justify-center">
          <img 
            src={design.imagenPortada} 
            alt={`Portada de ${texts?.nombreArtista || 'Catálogo'}`}
            className="max-h-96 w-auto object-contain"
          />
        </div>
      )}
      {texts?.textoPresentacion && (
        <p className="text-lg sm:text-xl leading-relaxed text-current opacity-80 max-w-3xl mx-auto">
          {texts.textoPresentacion}
        </p>
      )}
    </section>
  );
};

export default HeroSection;
