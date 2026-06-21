import React from 'react';
import { Edit, EyeOff, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { Product } from '../../types/catalog';
import { useCatalogStore } from '../../store/catalogStore';

interface ProductAdminCardProps {
  product: Product;
  onEdit: () => void;
}

const ProductAdminCard: React.FC<ProductAdminCardProps> = ({ product, onEdit }) => {
  const { deleteProduct, setProductStatus, moveProductUp, moveProductDown, categories } = useCatalogStore();

  const categoryName = product.categoriaId 
    ? categories.find(c => c.id === product.categoriaId)?.nombre || 'Categoría borrada'
    : 'Sin categoría';

  const getStatusBadge = () => {
    switch(product.estado) {
      case 'disponible': return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Disponible</span>;
      case 'vendido': return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Vendido</span>;
      case 'reservado': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Reservado</span>;
      case 'oculto': return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">Oculto</span>;
    }
  };

  return (
    <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="h-48 bg-gray-100 relative group">
        {product.imagenPrincipal ? (
          <img src={product.imagenPrincipal} alt={product.titulo} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Sin imagen
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => moveProductUp(product.id)}
            className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-blue-600"
            title="Subir"
          >
            <ArrowUp size={16} />
          </button>
          <button 
            onClick={() => moveProductDown(product.id)}
            className="p-1.5 bg-white rounded shadow text-gray-600 hover:text-blue-600"
            title="Bajar"
          >
            <ArrowDown size={16} />
          </button>
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 truncate pr-2" title={product.titulo}>
            {product.titulo || 'Sin título'}
          </h3>
          {getStatusBadge()}
        </div>
        
        <p className="text-sm text-gray-500 mb-4">{categoryName}</p>
        
        <div className="mt-auto flex justify-between border-t pt-3">
          <button 
            onClick={onEdit}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800"
          >
            <Edit size={16} className="mr-1" /> Editar
          </button>
          
          <div className="flex space-x-2">
            {product.estado !== 'oculto' && (
              <button 
                onClick={() => setProductStatus(product.id, 'oculto')}
                className="p-1.5 text-gray-500 hover:text-gray-800"
                title="Ocultar"
              >
                <EyeOff size={16} />
              </button>
            )}
            <button 
              onClick={() => {
                if (window.confirm('¿Seguro que deseas eliminar esta obra?')) {
                  deleteProduct(product.id);
                }
              }}
              className="p-1.5 text-red-500 hover:text-red-700"
              title="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdminCard;
