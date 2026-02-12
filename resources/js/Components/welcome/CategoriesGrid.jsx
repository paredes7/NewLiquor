import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react'; // Añadimos useRef
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoriesGrid({ categories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  // --- LÓGICA DE GESTOS TÁCTILES ---
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50; // Sensibilidad del deslizamiento
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }

    // Resetear valores
    touchStartX.current = null;
    touchEndX.current = null;
  };
  // --------------------------------

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerPage(1);
      else if (window.innerWidth < 1024) setItemsPerPage(3);
      else setItemsPerPage(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex + itemsPerPage >= categories.length;

  return (
    <section className="bg-white py-12 animate-blurred-fade-in">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Nuestras Categorías
            </h2>
            <p className="text-gray-500 text-sm">Explora nuestra selección</p>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={prevSlide} 
              disabled={isPrevDisabled}
              className={`p-2 rounded-full border transition-all ${
                isPrevDisabled 
                ? 'border-gray-100 text-gray-300' 
                : 'border-gray-200 text-gray-900 hover:bg-black hover:text-white'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextSlide} 
              disabled={isNextDisabled}
              className={`p-2 rounded-full border transition-all ${
                isNextDisabled 
                ? 'border-gray-100 text-gray-300' 
                : 'border-gray-200 text-gray-900 hover:bg-black hover:text-white'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* CONTENEDOR CON EVENTOS TÁCTILES */}
        <div 
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="popLayout">
            {visibleCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={`/products/${category.slug}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-xl"
                  onMouseEnter={() => setHoveredCard(category.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                    <img
                      src={category.image || "/images/placeholder-category.jpg"}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                    />
                  </div>

                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold text-black uppercase tracking-tight">
                      {category.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">
                      {category.description || "Explora la selección"}
                    </p>
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