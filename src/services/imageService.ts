export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No se seleccionó ningún archivo.'));
      return;
    }
    if (!file.type.startsWith('image/')) {
      reject(new Error('El archivo seleccionado no es una imagen válida.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Fallo al procesar la imagen (Canvas context).'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        
        // Export as WebP or JPEG with 0.8 quality
        const dataUrl = canvas.toDataURL('image/webp', 0.8);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Error al decodificar la imagen. Puede estar corrupta.'));
    };
    reader.onerror = () => reject(new Error('Error al leer el archivo desde el disco.'));
  });
};
