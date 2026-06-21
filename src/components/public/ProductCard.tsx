import React from 'react';
import type { Product } from '../../types/catalog';
import { formatPrice } from '../../utils/formatters';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const isSold = product.estado === 'vendido';
  const isReserved = product.estado === 'reservado';

  return (
    <div 
      className="group cursor-pointer flex flex-col gap-4"
      onClick={onClick}
    >
      <div className="relative overflow-hidden bg-gray-100 aspect-[4/5] flex items-center justify-center">
        {product.imagenPrincipal ? (
          <img 
            src={product.imagenPrincipal} 
            alt={product.titulo || 'Obra'} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400">
            <span className="font-light tracking-widest text-sm">SIN IMAGEN</span>
          </div>
        )}
        
        {/* Status Overlay */}
        {(isSold || isReserved) && (
          <div className="absolute inset-0 bg-white bg-opacity-20 flex items-center justify-center backdrop-blur-[2px] transition-opacity duration-300">
            <span className="px-4 py-2 bg-white text-black text-xs tracking-widest uppercase font-medium shadow-sm">
              {isSold ? 'Vendido' : 'Reservado'}
            </span>
          </div>
        )}
      </div>

      <div className="text-center">
        {product.titulo && (
          <h3 className="text-lg font-light tracking-wide mb-1 transition-colors duration-300 group-hover:opacity-70">
            {product.titulo}
          </h3>
        )}
        {product.precio && !isSold && (
          <p className="text-sm font-normal opacity-80">
            {formatPrice(product.precio)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
