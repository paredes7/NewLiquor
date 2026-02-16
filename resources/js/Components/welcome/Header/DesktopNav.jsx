import React, { useState } from 'react';
import MegaMenu from './MegaMenu';

export default function DesktopNav({ links, categories, allSubCategories, otrosLicoresData, NewProducts, handleAutoSearch }) {
  const [activeMenu, setActiveMenu] = useState(null);

  return (
    <nav className="hidden lg:flex items-center gap-8 font-semibold text-gray-700">
      {links.map((link) => {
        const isOtros = link.label === 'Otros licores';
        const isNuevos = link.label === 'Nuevos';
        
        const currentParent = categories?.find((cat) => {
          const labelLimpio = link.label.toLowerCase().trim();
          const slugLimpio = cat.slug.toLowerCase().trim();
          return slugLimpio === labelLimpio;
        });

        const displaySubCategories = isNuevos 
          ? NewProducts 
          : (isOtros ? otrosLicoresData : allSubCategories?.filter(sub => sub.parent_id === currentParent?.id) || []);

        return (
          <div 
            key={link.href}
            className="relative"
            onMouseEnter={() => {
              if (isNuevos) setActiveMenu('nuevos');
              else if (isOtros) setActiveMenu('otros');
              else if (currentParent) setActiveMenu(currentParent.slug);
            }}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <button 
              onClick={(e) => handleAutoSearch(e, link.label)} 
              className="flex items-center gap-1 py-4 hover:text-orange-600 transition-colors"
            >
              {link.label}
            </button>

            {activeMenu && (
              ((isNuevos && activeMenu === 'nuevos') || 
               (isOtros && activeMenu === 'otros') || 
               (activeMenu === currentParent?.slug))
            ) && displaySubCategories.length > 0 && (
              <MegaMenu 
                parentCategory={isNuevos ? { name: 'Novedades', slug: 'nuevos' } : (isOtros ? { name: 'Otros Licores', slug: 'otros' } : currentParent)} 
                subCategories={displaySubCategories} 
                type={isNuevos ? 'products' : 'categories'} 
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}