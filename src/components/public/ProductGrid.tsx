import React, { useState } from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import EmptyCatalog from './EmptyCatalog';
import type { Product } from '../../types/catalog';

interface ProductGridProps {
  selectedCategory: string | null;
}

const ProductGrid: React.FC<ProductGridProps> = ({ selectedCategory }) => {
  const { products, design } = useCatalogStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const visibleProducts = products
    .filter(p => p.estado !== 'oculto')
    .filter(p => (selectedCategory ? p.categoriaId === selectedCategory : true))
    .sort((a, b) => a.orden - b.orden);

  if (visibleProducts.length === 0) {
    return <EmptyCatalog />;
  }

  const getGridClass = () => {
    const columnClassMap: Record<number, string> = {
      2: 'lg:grid-cols-2',
      3: 'lg:grid-cols-3',
      4: 'lg:grid-cols-4',
    };
    const desktopCols = design.columnasDesktop || 3;
    const desktopClass = columnClassMap[desktopCols] || 'lg:grid-cols-3';

    switch (design.estiloGrilla) {
      case 'masonry':
        return 'masonry-grid';
      case 'editorial':
        return 'grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24';
      case 'minimalista':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16';
      case 'galeria':
      default:
        return `grid grid-cols-1 sm:grid-cols-2 ${desktopClass} gap-x-8 gap-y-12`;
    }
  };

  return (
    <>
      <div className={getGridClass()}>
        {visibleProducts.map(product => {
          const isLarge = product.tamanoTarjeta === 'grande' && design.estiloGrilla !== 'masonry';
          const colSpanClass = isLarge ? 'lg:col-span-2' : '';
          
          return (
            <div 
              key={product.id} 
              className={`${design.estiloGrilla === 'masonry' ? 'masonry-item' : ''} ${colSpanClass}`.trim()}
            >
              <ProductCard product={product} onClick={() => setSelectedProduct(product)} />
            </div>
          );
        })}
      </div>
      
      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </>
  );
};

export default ProductGrid;
