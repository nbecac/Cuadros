import React from 'react';
import PublicLayout from '../components/public/PublicLayout';
import HeroSection from '../components/public/HeroSection';
import CategoryFilter from '../components/public/CategoryFilter';
import ProductGrid from '../components/public/ProductGrid';
import { useCatalogStore } from '../store/catalogStore';

const PublicCatalog: React.FC = () => {
  const { design, categories, texts } = useCatalogStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const activeCategories = categories.filter(c => c.activa).sort((a, b) => a.orden - b.orden);

  return (
    <PublicLayout>
      {design.mostrarHero && <HeroSection />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {texts?.tituloCatalogo && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-light tracking-wide uppercase mb-4">
              {texts.tituloCatalogo}
            </h2>
            {texts.textoCatalogo && (
              <p className="text-gray-500 max-w-2xl mx-auto">
                {texts.textoCatalogo}
              </p>
            )}
          </div>
        )}

        {design.mostrarCategorias && activeCategories.length > 0 && (
          <CategoryFilter 
            categories={activeCategories} 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        )}
        
        <ProductGrid selectedCategory={selectedCategory} />
      </div>
    </PublicLayout>
  );
};

export default PublicCatalog;
