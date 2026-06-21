import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import type { Product } from '../../types/catalog';
import { formatPrice } from '../../utils/formatters';
import { createWhatsAppLink } from '../../utils/whatsapp';
import { useCatalogStore } from '../../store/catalogStore';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { contact } = useCatalogStore();
  const isSold = product.estado === 'vendido';
  const isReserved = product.estado === 'reservado';

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const whatsappLink = contact.whatsapp 
    ? createWhatsAppLink(contact.whatsapp, contact.mensajeWhatsAppPrellenado, product.titulo)
    : '';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4 sm:p-6 lg:p-12 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white text-gray-900 w-full max-w-6xl max-h-full flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-black bg-white bg-opacity-50 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-8 min-h-[40vh] overflow-y-auto">
          {product.imagenPrincipal ? (
            <img 
              src={product.imagenPrincipal} 
              alt={product.titulo || 'Obra'} 
              className="max-w-full max-h-[70vh] object-contain shadow-lg mb-4"
            />
          ) : (
            <div className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 max-h-[70vh] mb-4">
              <span className="font-light tracking-widest">SIN IMAGEN</span>
            </div>
          )}
          
          {/* Galería extra */}
          {product.galeria && product.galeria.length > 0 && (
            <div className="flex gap-4 overflow-x-auto w-full py-4 snap-x">
              {product.galeria.map((imgUrl, idx) => (
                <img 
                  key={idx}
                  src={imgUrl} 
                  alt={`${product.titulo || 'Detalle'} ${idx + 1}`}
                  className="h-24 w-auto object-cover border shadow-sm snap-center"
                  loading="lazy"
                />
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col overflow-y-auto max-h-[80vh]">
          <div className="mb-8">
            {(isSold || isReserved) && (
              <span className="inline-block px-3 py-1 mb-4 text-xs tracking-widest uppercase border border-gray-300">
                {isSold ? 'Vendido' : 'Reservado'}
              </span>
            )}
            
            {product.titulo && (
              <h2 className="text-3xl sm:text-4xl font-light mb-4">{product.titulo}</h2>
            )}
            
            {product.precio && !isSold && (
              <p className="text-xl font-medium mb-6">{formatPrice(product.precio)}</p>
            )}
            
            <div className="space-y-2 text-sm text-gray-600 mb-8">
              {product.medidas && <p><span className="text-gray-400">Medidas:</span> {product.medidas}</p>}
              {product.tecnica && <p><span className="text-gray-400">Técnica:</span> {product.tecnica}</p>}
              {product.ano && <p><span className="text-gray-400">Año:</span> {product.ano}</p>}
            </div>
            
            {product.descripcion && (
              <div className="prose prose-sm font-light text-gray-700 max-w-none mb-8 leading-relaxed">
                {product.descripcion.split('\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto pt-8 border-t border-gray-100">
            {whatsappLink && !isSold ? (
              <a 
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-black text-white px-8 py-4 text-sm tracking-widest uppercase hover:bg-gray-800 transition-colors"
              >
                Consultar por WhatsApp
              </a>
            ) : (
              <button 
                disabled
                className="w-full block text-center bg-gray-100 text-gray-400 px-8 py-4 text-sm tracking-widest uppercase cursor-not-allowed"
              >
                {isSold ? 'Obra no disponible' : 'Consultar'}
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductModal;
