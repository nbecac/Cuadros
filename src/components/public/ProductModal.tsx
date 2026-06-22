import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../types/catalog';
import { formatPrice } from '../../utils/formatters';
import { createWhatsAppLink } from '../../utils/whatsapp';
import { useCatalogStore } from '../../store/catalogStore';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const modalImageSizeMap: Record<string, string> = {
  normal: 'max-h-[65vh]',
  grande: 'max-h-[75vh]',
  contenido: 'max-h-[55vh]',
};

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { contact } = useCatalogStore();
  const isSold = product.estado === 'vendido';
  const isReserved = product.estado === 'reservado';

  const images = [product.imagenPrincipal, ...(product.galeria || [])].filter(Boolean) as string[];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex];

  const modalImageSizeClass = modalImageSizeMap[product.tamanoModal || 'normal'] || 'max-h-[65vh]';

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

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const whatsappLink = contact.whatsapp 
    ? createWhatsAppLink(contact.whatsapp, contact.mensajeWhatsAppPrellenado, product.titulo)
    : '';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm p-4 sm:p-6 lg:p-12"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-white text-gray-900 w-full max-w-6xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-gray-500 hover:text-black bg-white bg-opacity-50 rounded-full transition-colors"
          aria-label="Cerrar"
        >
          <X size={24} strokeWidth={1.5} />
        </button>

        {/* Image Section */}
        <div className="w-full md:w-3/5 bg-gray-50 flex flex-col items-center justify-center relative p-4 min-h-[40vh] md:min-h-full">
          {activeImage ? (
            <div className="relative w-full flex items-center justify-center h-full">
              {images.length > 1 && (
                <button 
                  onClick={prevImage}
                  className="absolute left-2 md:left-4 p-2 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md transition-all z-10"
                >
                  <ChevronLeft size={24} />
                </button>
              )}
              
              <img 
                src={activeImage} 
                alt={product.titulo || 'Obra'} 
                className={`w-full ${modalImageSizeClass} object-contain shadow-sm`}
              />

              {images.length > 1 && (
                <button 
                  onClick={nextImage}
                  className="absolute right-2 md:right-4 p-2 bg-white/70 hover:bg-white text-gray-800 rounded-full shadow-md transition-all z-10"
                >
                  <ChevronRight size={24} />
                </button>
              )}
              
              {images.length > 1 && (
                <div className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
                  {activeIndex + 1} / {images.length}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-square max-h-[75vh] bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-400 mb-4">
              <span className="font-light tracking-widest">SIN IMAGEN</span>
            </div>
          )}
          
          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto w-full py-4 mt-auto justify-center">
              {images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`relative flex-shrink-0 transition-all ${activeIndex === idx ? 'ring-2 ring-black' : 'opacity-60 hover:opacity-100'}`}
                >
                  <img 
                    src={imgUrl} 
                    alt={`Miniatura ${idx + 1}`}
                    className="w-16 h-16 object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/5 p-6 sm:p-8 lg:p-12 flex flex-col overflow-y-auto max-h-[40vh] md:max-h-full">
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
