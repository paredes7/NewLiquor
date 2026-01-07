import { Link } from '@inertiajs/react';
import { useState } from 'react';
import axios from 'axios';

export default function CategoriesGrid({ categories: initialCategories, hasMore: initialHasMore }) {
  const [categories, setCategories] = useState(initialCategories);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [offset, setOffset] = useState(initialCategories.length);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await axios.get('/ventas/json', {
        params: { offset }
      });

      const newCategories = response.data.categories;
      setCategories([...categories, ...newCategories]);
      setOffset(offset + newCategories.length);
      setHasMore(response.data.hasMore);
    } catch (err) {
      console.error('Error cargando más categorías:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white animate-blurred-fade-in">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={`/products/${category.slug}`}
              className="group relative bg-white rounded-xl overflow-hidden
                         border border-gray-200
                         transition-all duration-500
                         hover:shadow-xl hover:border-gray-300"
              style={{
                animationDelay: `${index * 80}ms`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0
              }}
              onMouseEnter={() => setHoveredCard(category.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                <img
                  src={category.image || `https://via.placeholder.com/480x360/f3f4f6/111827?text=${category.name}`}
                  alt={category.name}
                  className="absolute inset-0 w-full h-full object-cover
                             transition-transform duration-700
                             group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t
                                from-black/70 via-black/30 to-transparent
                                opacity-0 group-hover:opacity-100
                                transition-opacity duration-500" />
                <div className="absolute inset-0 border-2 border-transparent
                                group-hover:border-white/30
                                transition-all duration-500" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                                transition-opacity duration-700 pointer-events-none">
                  <div className="absolute top-0 -left-full w-1/2 h-full
                                  bg-gradient-to-r from-transparent via-white/20 to-transparent
                                  skew-x-12 animate-shine" />
                </div>
              </div>

              <div className="relative px-4 py-5 text-center">
                <h3 className="text-base font-bold text-black tracking-wide">
                  {category.name.toUpperCase()}
                </h3>
                {category.description && (
                  <p className="mt-1 text-sm text-gray-500">{category.description}</p>
                )}

                <div
                  className={`mt-3 flex justify-center items-center gap-2
                              text-sm font-semibold text-black
                              transition-all duration-500 ${
                    hoveredCard === category.id
                      ? 'opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-3'
                  }`}
                >
                  <span>Ver modelos</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

       
        {hasMore && (
  <div className="flex justify-center mt-6">
    <button
      onClick={loadMore}
      disabled={loading}
      className="
        px-6 py-2 
        bg-black text-white font-semibold 
        rounded-xl 
        shadow-lg 
        hover:bg-white hover:text-black hover:scale-105 
        transition-all duration-300 
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {loading ? 'Cargando...' : 'Ver más'}
    </button>
  </div>
)}

      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }

        .animate-shine {
          animation: shine 3s infinite;
        }
      `}</style>
    </section>
  );
}
