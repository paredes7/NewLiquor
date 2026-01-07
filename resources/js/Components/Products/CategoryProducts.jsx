import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CategoryProducts({ category }) {
    const [hoveredCard, setHoveredCard] = useState(null);

    if (!category) return null;

    const renderProductsGrid = (products) => (
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-6">
            {products.map((p) => (
                <div
                    key={p.id}
                    className="group relative bg-white rounded-2xl overflow-hidden
                   border border-gray-200
                   transition-all duration-500
                   hover:shadow-2xl hover:border-gray-300"
                    onMouseEnter={() => setHoveredCard(p.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                >

                    <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                        <img
                            src={p.multimedia?.[0]?.url || '/placeholder.png'}
                            alt={p.name || 'Producto'}
                            className="absolute inset-0 w-full h-full object-cover
                       transition-transform duration-700
                       group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t
                          from-black/40 via-black/20 to-transparent
                          opacity-0 group-hover:opacity-100
                          transition-opacity duration-500" />
                        <div className="absolute inset-0 border-2 border-transparent
                          group-hover:border-white/40
                          transition-all duration-500" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100
                          transition-opacity duration-700 pointer-events-none">
                            <div className="absolute top-0 -left-full w-1/2 h-full
                            bg-gradient-to-r from-transparent via-white/20 to-transparent
                            skew-x-12 animate-shine" />
                        </div>
                    </div>


                    <div className="relative px-6 py-6 text-center">

                        <h3 className="text-lg sm:text-2xl font-bold text-black line-clamp-2">
                            {p.name}
                        </h3>


                        <div className="my-3 h-0.5 w-full  bg-gray-400 rounded-full"></div>

                        {p.description && (
                            <p className="text-sm sm:text-base text-gray-600 line-clamp-3">
                                {p.description}
                            </p>
                        )}


                        <Link
                            href={`/products/${p.name.toLowerCase().replace(/\s+/g, '-')}/${p.id}`}
                            className="mt-5 inline-block w-full py-3 bg-black text-white font-semibold
                            rounded-xl shadow-md hover:bg-gray-800 transition-colors"
                        >
                            Conocer más
                        </Link>
                    </div>


                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full space-y-16">

            {category.products?.length > 0 && renderProductsGrid(category.products)}


            {category.children?.length > 0 && (
                <div className="space-y-16">
                    {category.children.map((sub) => (
                        <div key={sub.id}>

                            <h2 className="w-full text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold
                                           mb-6 text-white bg-gray-900   shadow-md px-6 py-4 ">
                                {sub.name}
                            </h2>


                            {sub.products?.length > 0
                                ? renderProductsGrid(sub.products)
                                : (
                                    <p className="text-gray-500 italic text-center">
                                        No hay productos disponibles.
                                    </p>
                                )
                            }
                        </div>
                    ))}
                </div>
            )}


            {(!category.products?.length && !category.children?.length) && (
                <p className="text-gray-500 italic text-center">
                    No hay productos disponibles.
                </p>
            )}

            <style>{`
                @keyframes shine {
                  0% { left: -100%; }
                  100% { left: 200%; }
                }

                .animate-shine {
                  animation: shine 3s infinite;
                }
            `}</style>
        </div>
    );
}
