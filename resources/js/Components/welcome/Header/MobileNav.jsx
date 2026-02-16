import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';

export default function MobileNav({ isOpen, links, categories, allSubCategories, otrosLicoresData, NewProducts, handleAutoSearch, setMobileMenuOpen }) {
  const [expandedSection, setExpandedSection] = useState(null);

  return (
    <div
      className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out bg-white ${
        isOpen ? 'max-h-[80vh] overflow-y-auto border-t border-gray-100' : 'max-h-0'
      }`}
    >
      <nav className="container mx-auto px-6 py-4 flex flex-col gap-1">
        {links.map((link) => {
          const sectionKey = link.label.toLowerCase().replace(/\s+/g, '-');
          const isExpanded = expandedSection === sectionKey;
          const isNuevos = link.label === 'Nuevos';
          const isOtros = link.label === 'Otros licores';
          
          const currentParent = categories?.find(cat => cat.slug === (isNuevos ? 'nuevos' : (isOtros ? 'otros' : sectionKey)));
          
          const displayData = isNuevos ? NewProducts : 
                              isOtros ? otrosLicoresData : 
                              allSubCategories?.filter(sub => sub.parent_id === currentParent?.id) || [];

          return (
            <div key={link.href} className="flex flex-col border-b border-gray-50 last:border-none">
              <div className="flex justify-between items-center">
                <button
                  onClick={(e) => {
                    handleAutoSearch(e, link.label);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 text-left text-gray-700 hover:text-orange-600 font-bold py-4"
                >
                  {link.label}
                </button>
                
                {displayData.length > 0 && (
                  <button 
                    onClick={() => setExpandedSection(isExpanded ? null : sectionKey)}
                    className="p-4 text-black"
                  >
                    <svg 
                      className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                )}
              </div>

              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[600px] opacity-100 mb-4' : 'max-h-0 opacity-0'}`}>
                <div className="grid grid-cols-1 gap-4 pl-4 border-l-2 border-orange-500 bg-gray-50/50 p-3 rounded-r-xl">
                  {displayData.map((item) => (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        if (isNuevos) router.get(`/producto/${item.slug}`);
                        else handleAutoSearch(e, item.name);
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-4 group text-left w-full"
                    >
                      {isNuevos && item.image_url && (
                        <img src={item.image_url} className="w-10 h-10 object-contain bg-white rounded-md border border-gray-100" />
                      )}
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">{item.name}</span>
                        <span className="text-[11px] text-gray-400">
                          {isNuevos ? `${item.price} BOB` : item.description}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}