export const createWhatsAppLink = (phone?: string, text?: string, productTitle?: string): string => {
  if (!phone) return '';
  
  // Clean phone number (remove everything except digits)
  const cleanPhone = phone.replace(/\D/g, '');
  
  let finalMessage = text || 'Hola';
  
  if (productTitle) {
    finalMessage = `Hola, me interesa consultar por esta obra: ${productTitle}`;
  } else if (!text) {
    finalMessage = 'Hola, me interesa consultar por esta obra.';
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(finalMessage)}`;
};
