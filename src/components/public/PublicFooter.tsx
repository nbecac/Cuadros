import React from 'react';
import { useCatalogStore } from '../../store/catalogStore';
import { createWhatsAppLink } from '../../utils/whatsapp';

const PublicFooter: React.FC = () => {
  const { contact, texts, design } = useCatalogStore();

  const whatsappLink = contact.whatsapp 
    ? createWhatsAppLink(contact.whatsapp, contact.mensajeWhatsAppPrellenado)
    : '';

  return (
    <footer className="mt-24 py-12 px-4 border-t border-opacity-10 border-current">
      <div className="max-w-4xl mx-auto text-center">
        {design.mostrarContacto && (
          <div className="mb-12">
            {texts?.tituloContacto && (
              <h3 className="text-xl font-light tracking-widest uppercase mb-6">
                {texts.tituloContacto}
              </h3>
            )}
            
            {texts?.textoContacto && (
              <p className="mb-8 opacity-80 font-light max-w-2xl mx-auto">
                {texts.textoContacto}
              </p>
            )}

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm tracking-widest uppercase">
              {whatsappLink && (
                <a 
                  href={whatsappLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  WhatsApp
                </a>
              )}
              {contact.instagram && (
                <a 
                  href={`https://instagram.com/${contact.instagram.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity"
                >
                  Instagram
                </a>
              )}
              {contact.correo && (
                <a 
                  href={`mailto:${contact.correo}`}
                  className="hover:opacity-70 transition-opacity"
                >
                  Email
                </a>
              )}
            </div>
          </div>
        )}
        
        {texts?.textoFooter && (
          <div className="text-xs opacity-40 font-light">
            {texts.textoFooter}
          </div>
        )}
        {texts?.firma && (
          <div className="mt-2 text-xs opacity-30 font-light italic">
            {texts.firma}
          </div>
        )}
      </div>
    </footer>
  );
};

export default PublicFooter;
