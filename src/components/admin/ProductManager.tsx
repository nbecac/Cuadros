import React, { useState } from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import ProductAdminCard from './ProductAdminCard';
import ProductEditor from './ProductEditor';
import { Plus } from 'lucide-react';

const ProductManager: React.FC = () => {
  const { products } = useCatalogStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const sortedProducts = [...products].sort((a, b) => a.orden - b.orden);

  const handleAddNew = () => {
    setEditingProductId(null);
    setIsEditing(true);
  };

  const handleEdit = (id: string) => {
    setEditingProductId(id);
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <ProductEditor 
        productId={editingProductId} 
        onClose={() => setIsEditing(false)} 
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Gestión de Obras</h2>
        <button
          onClick={handleAddNew}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Obra
        </button>
      </div>

      {sortedProducts.length === 0 ? (
        <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
          No hay obras en el catálogo.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => (
            <ProductAdminCard 
              key={product.id} 
              product={product} 
              onEdit={() => handleEdit(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductManager;
