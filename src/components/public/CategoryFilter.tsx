import React from 'react';
import type { Category } from '../../types/catalog';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (id: string | null) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="mb-12 flex flex-wrap justify-center gap-4">
      <button
        onClick={() => onSelectCategory(null)}
        className={`px-4 py-2 text-sm tracking-wide transition-all duration-300 ${
          selectedCategory === null 
            ? 'border-b-2 border-current font-normal' 
            : 'text-current opacity-60 hover:opacity-100 hover:border-b hover:border-current border-b-2 border-transparent'
        }`}
      >
        TODAS
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`px-4 py-2 text-sm tracking-wide transition-all duration-300 ${
            selectedCategory === category.id 
              ? 'border-b-2 border-current font-normal' 
              : 'text-current opacity-60 hover:opacity-100 hover:border-b hover:border-current border-b-2 border-transparent'
          }`}
        >
          {category.nombre.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
