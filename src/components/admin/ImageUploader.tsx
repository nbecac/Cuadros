import React, { useRef, useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage, removeImage } from '../../services/cloudImageService';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove: () => void;
  label?: string;
  compact?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ value, onChange, onRemove, label = 'Imagen', compact = false }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor, selecciona un archivo de imagen válido.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      
      const url = await uploadImage(file);
      
      // Si había una imagen anterior, la eliminamos de storage
      if (value) {
        await removeImage(value);
      }
      
      onChange(url);
    } catch (err) {
      setError('Error al procesar o subir la imagen. Intenta con otra.');
      console.error(err);
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (value) {
      try {
        setIsProcessing(true);
        await removeImage(value);
        onRemove();
      } catch (err) {
        console.error('Error removing image:', err);
        // Aun si falla, removemos la ref local
        onRemove();
      } finally {
        setIsProcessing(false);
      }
    } else {
      onRemove();
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      
      {value ? (
        <div className={`relative inline-block border rounded-md overflow-hidden bg-gray-100 ${compact ? 'w-24 h-24' : 'w-full max-w-sm h-64'}`}>
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            disabled={isProcessing}
            className="absolute top-2 right-2 p-1 bg-white bg-opacity-80 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors shadow-sm disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
          {isProcessing && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
          )}
        </div>
      ) : (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center text-blue-500">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <span className="text-sm">Subiendo...</span>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">Haz clic para subir imagen</span>
              <span className="text-xs text-gray-400 mt-1">Máx. 1200px (se comprime automáticamente)</span>
            </>
          )}
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default ImageUploader;
