import React from 'react';

const EmptyCatalog: React.FC = () => {
  return (
    <div className="py-24 flex flex-col items-center justify-center text-center opacity-60">
      <div className="w-16 h-16 mb-6 border border-current rounded-full flex items-center justify-center">
        <span className="text-2xl font-light">?</span>
      </div>
      <h3 className="text-xl font-light tracking-widest uppercase mb-2">
        Catálogo Vacío
      </h3>
      <p className="font-light">
        Pronto publicaremos nuevas obras.
      </p>
    </div>
  );
};

export default EmptyCatalog;
