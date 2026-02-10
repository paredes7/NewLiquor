z
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoriesGrid({ categories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const itemsPerPage = 5;

  // Lógica de navegación con límites
  const nextSlide = () => {
    if (currentIndex + itemsPerPage < categories.length) {
      setCurrentIndex(currentIndex + itemsPerPage);
    }
  };

  const prevSlide = () => {
    if (currentIndex - itemsPerPage >= 0) {
      setCurrentIndex(currentIndex - itemsPerPage);
    }
  };

  const visibleCategories = categories.slice(currentIndex, currentIndex + itemsPerPage);

  // Estados de los botones
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + itemsPerPage >= categories.length;

  return (
    <section className="bg-white py-12 animate-blurred-fade-in">
      <div className="max-w-7xl mx-auto px-6 relative group/main">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Nuestras Categorías
            </h2>
            <p className="text-gray-500 text-sm">Explora nuestra selección</p>
          </div>

          {/* Botones de Navegación con Bloqueo */}
          <div className="flex gap-2">
            <button 
              onClick={prevSlide} 
              disabled={isPrevDisabled}
              className={`p-2 rounded-full border transition-all shadow-sm ${
                isPrevDisabled 
                ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                : 'border-gray-200 text-gray-900 hover:bg-orange-600 hover:text-white active:scale-95'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide} 
              disabled={isNextDisabled}
              className={`p-2 rounded-full border transition-all shadow-sm ${
                isNextDisabled 
                ? 'border-gray-100 text-gray-300 cursor-not-allowed' 
                : 'border-gray-200 text-gray-900 hover:bg-orange-600 hover:text-white active:scale-95'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Contenedor del Carrusel */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/products/${category.slug}`}
                  className="group relative block bg-white rounded-xl overflow-hidden border border-gray-200 transition-all duration-500 hover:shadow-xl hover:border-gray-300"
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img
                      src={category.image || "/images/placeholder-category.jpg"}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  <div className="relative px-4 py-5 text-center">
                    <h3 className="text-base font-bold text-black tracking-wide uppercase">
                      {category.name}
                    </h3>

                    {/* RECUPERAMOS LA DESCRIPCIÓN AQUÍ */}
                    <p className="mt-1 text-xs text-gray-500 min-h-[32px] line-clamp-2">
                      {category.description || "Los mejores productos seleccionados para ti."}
                    </p>
                    
                    <div
                      className={`mt-3 flex justify-center items-center gap-2 text-sm font-semibold text-black transition-all duration-500 ${
                        hoveredCard === category.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                      }`}
                    >
                      <span className="text-[11px] uppercase tracking-wider">Ver modelos</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}