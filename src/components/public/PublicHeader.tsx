import React from 'react';
import { useCatalogStore } from '../../store/catalogStore';

const PublicHeader: React.FC = () => {
  const { texts } = useCatalogStore();

  if (!texts?.nombreArtista) return null;

  return (
    <header className="py-8 px-4 sm:px-6 lg:px-8 border-b border-opacity-10 border-current">
      <div className="max-w-7xl mx-auto flex justify-center items-center flex-col gap-2">
        <h1 className="text-3xl sm:text-4xl tracking-widest uppercase font-extralight text-center">
          {texts.nombreArtista}
        </h1>
        {texts.subtitulo && (
          <h2 className="text-sm tracking-widest uppercase text-center opacity-70">
            {texts.subtitulo}
          </h2>
        )}
      </div>
    </header>
  );
};

export default PublicHeader;
